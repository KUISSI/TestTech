from fastapi import APIRouter, HTTPException, Depends
import logging
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.database import SessionLocal, init_db
from app.models import Customer, Sale
import httpx
import json

logging.basicConfig(level=logging.INFO)
router = APIRouter()

HIBOUTIK_BASE_URL = "https://techtest.hiboutik.com/api"
API_USER = "techtest@gmail.com"
API_KEY = "2OZ58K8MYZV56SFA59NG2PQ2HYW4C6280IT"

# --- DB Helpers ---

def get_customer_by_name(db: Session, name: str):
    search_term = name.lower()
    return db.query(Customer).filter(
        (Customer.last_name.ilike(f"%{search_term}%")) |
        (Customer.first_name.ilike(f"%{search_term}%"))
    ).all()

def get_customer_by_customers_id(db: Session, customers_id: int):
    return db.query(Customer).filter(Customer.customers_id == customers_id).first()

def add_or_update_customers(db: Session, customers: list):
    for c in customers:
        db_customer = db.query(Customer).filter(Customer.customers_id == c.get("customers_id", c.get("id"))).first()
        if not db_customer:
            db_customer = Customer(
                customers_id=c.get("customers_id", c.get("id")),
                first_name=c.get("first_name"),
                last_name=c.get("last_name"),
                email=c.get("email"),
                phone=c.get("phone")
            )
            db.add(db_customer)
    db.commit()

def add_or_update_sales(db: Session, client_id: int, sales: list):
    customer = db.query(Customer).filter(Customer.customers_id == client_id).first()
    if not customer:
        logging.warning(f"No customer found in DB for client_id={client_id} when adding sales.")
        return
    for s in sales:
        # Accept both 'sale_id' and 'sales_id' as keys
        sale_id = s.get("sale_id") or s.get("sales_id")
        # Accept both 'total' as float or string
        total = s.get("total")
        if total is None:
            total = s.get("total_tax_incl")
        if isinstance(total, str):
            try:
                total = float(total)
            except Exception:
                total = 0.0
        total_tax_incl = s.get("total_tax_incl")
        if total_tax_incl is None:
            total_tax_incl = s.get("total")
        if isinstance(total_tax_incl, str):
            try:
                total_tax_incl = float(total_tax_incl)
            except Exception:
                total_tax_incl = None
        date = s.get("date") or s.get("created_at") or s.get("completed_at")
        products = s.get("products", [])
        if not isinstance(products, list):
            try:
                products = json.loads(products)
            except Exception:
                products = []
        db_sale = db.query(Sale).filter(Sale.sale_id == sale_id, Sale.customer_id == customer.id).first()
        if not db_sale:
            db_sale = Sale(
                sale_id=sale_id,
                total=total,
                total_tax_incl=total_tax_incl,
                date=date,
                products=json.dumps(products),
                customer_id=customer.id
            )
            db.add(db_sale)
            logging.info(f"Added sale {sale_id} for customer {customer.customers_id} (total={total}, total_tax_incl={total_tax_incl}, date={date})")
        else:
            logging.info(f"Sale {sale_id} for customer {customer.customers_id} already exists in DB.")
    db.commit()

# --- Hiboutik API Fetching ---

async def sync_customers_from_hiboutik():
    url = f"{HIBOUTIK_BASE_URL}/customers"
    headers = {"accept": "application/json"}
    auth = httpx.BasicAuth(API_USER, API_KEY)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, auth=auth)
            response.raise_for_status()
            customers = response.json()
            db = SessionLocal()
            add_or_update_customers(db, customers)
            db.close()
            logging.info(f"Successfully synced and saved {len(customers)} customers to DB.")
            return customers
        except Exception as e:
            logging.error(f"Error fetching customers from Hiboutik: {e}")
            return []

async def fetch_sales_from_hiboutik(client_id: int):
    url = f"{HIBOUTIK_BASE_URL}/customer/{client_id}/sales"  # Fixed endpoint (singular 'customer')
    headers = {"accept": "application/json"}
    auth = httpx.BasicAuth(API_USER, API_KEY)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, auth=auth)
            response.raise_for_status()
            sales = response.json()
            return sales
        except Exception as e:
            logging.error(f"Error fetching sales for client {client_id} from Hiboutik: {e}")
            return []

# --- API Endpoints ---

@router.post("/sync_customers")
async def sync_customers(current_user: dict = Depends(get_current_user)):
    customers = await sync_customers_from_hiboutik()
    if customers:
        return {"message": f"Successfully synced {len(customers)} customers."}
    raise HTTPException(status_code=500, detail="Failed to sync customers from Hiboutik.")

@router.get("/clients")
async def get_clients(name: str, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    customers = get_customer_by_name(db, name)
    if not customers:
        logging.info("No local customers found in DB, attempting to sync from Hiboutik.")
        customers = await sync_customers_from_hiboutik()
        add_or_update_customers(db, customers)
        customers = get_customer_by_name(db, name)
    db.close()
    return [
        {
            "customers_id": c.customers_id,
            "first_name": c.first_name,
            "last_name": c.last_name,
            "email": c.email,
            "phone": c.phone
        } for c in customers
    ]

@router.get("/clients/{client_id}/sales")
async def get_sales(client_id: int, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    customer = db.query(Customer).filter(Customer.customers_id == client_id).first()
    if not customer:
        db.close()
        return []
    sales = db.query(Sale).filter(Sale.customer_id == customer.id).all()
    if sales:
        db.close()
        return [
            {
                "sale_id": s.sale_id,
                "total": s.total,
                "total_tax_incl": s.total_tax_incl,
                "date": s.date,
                "products": json.loads(s.products) if s.products else []
            } for s in sales
        ]
    # If not found in DB, fetch from Hiboutik
    hiboutik_sales = await fetch_sales_from_hiboutik(client_id)
    if hiboutik_sales:
        add_or_update_sales(db, client_id, hiboutik_sales)
        sales = db.query(Sale).filter(Sale.customer_id == customer.id).all()
        db.close()
        return [
            {
                "sale_id": s.sale_id,
                "total": s.total,
                "total_tax_incl": s.total_tax_incl,
                "date": s.date,
                "products": json.loads(s.products) if s.products else []
            } for s in sales
        ]
    db.close()
    return []
