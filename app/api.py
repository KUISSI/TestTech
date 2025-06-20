import httpx
from fastapi import APIRouter, HTTPException, Depends
import logging
import json
from pathlib import Path
from .auth import get_current_user

logging.basicConfig(level=logging.INFO)
router = APIRouter()

HIBOUTIK_BASE_URL = "https://techtest.hiboutik.com/api"
API_USER = "techtest@gmail.com"
API_KEY = "2OZ58K8MYZV56SFA59NG2PQ2HYW4C6280IT"

DATA_DIR = Path("data")
CUSTOMERS_FILE = DATA_DIR / "customers.json"
SALES_FILE = DATA_DIR / "sales.json"

# --- File-based Caching Helpers ---

def load_from_file(path: Path) -> list | dict:
    if not path.exists():
        return [] if str(path).endswith('s.json') else {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_to_file(path: Path, data):
    DATA_DIR.mkdir(exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

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
            save_to_file(CUSTOMERS_FILE, customers)
            logging.info(f"Successfully synced and saved {len(customers)} customers.")
            return customers
        except Exception as e:
            logging.error(f"Error fetching customers from Hiboutik: {e}")
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
    customers = load_from_file(CUSTOMERS_FILE)
    if not customers:
        logging.info("No local customers found, attempting to sync from Hiboutik.")
        customers = await sync_customers_from_hiboutik()

    search_term = name.lower()
    filtered = [
        c for c in customers
        if search_term in c.get("last_name", "").lower() or search_term in c.get("first_name", "").lower()
    ]
    logging.info(f"Found {len(filtered)} clients matching '{name}' from local file.")
    return filtered

@router.get("/clients/{client_id}/sales")
async def get_sales(client_id: int, current_user: dict = Depends(get_current_user)):
    all_sales = load_from_file(SALES_FILE)
    client_id_str = str(client_id)

    if client_id_str in all_sales:
        logging.info(f"Found sales for client {client_id} in local cache.")
        return all_sales[client_id_str]

    logging.info(f"No local sales found for client {client_id}, fetching from Hiboutik.")
    url = f"{HIBOUTIK_BASE_URL}/customer/{client_id}/sales"
    headers = {"accept": "application/json"}
    auth = httpx.BasicAuth(API_USER, API_KEY)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, auth=auth)
            response.raise_for_status()
            sales_data = response.json()
            
            # Save the new sales data to the cache
            all_sales[client_id_str] = sales_data
            save_to_file(SALES_FILE, all_sales)
            logging.info(f"Saved sales for client {client_id} to local cache.")
            
            return sales_data
        except Exception as e:
            logging.error(f"Error fetching sales for client {client_id}: {e}")
            return []

@router.get("/clients/{client_id}/sales_paginated")
async def get_sales_paginated(client_id: int, page: int = 1, size: int = 10, current_user: dict = Depends(get_current_user)):
    """
    Retrieves paginated sales for a given client.
    Fetches all sales and applies pagination.
    """
    # This reuses the logic from get_sales to fetch all sales for the client
    all_client_sales = await get_sales(client_id, current_user)

    if not isinstance(all_client_sales, list):
        # If get_sales returned an error (like a HTTPException), propagate it
        return all_client_sales

    start = (page - 1) * size
    end = start + size
    paginated_sales = all_client_sales[start:end]

    logging.info(f"Returning {len(paginated_sales)} paginated sales for client {client_id} (page {page}, size {size}).")
    return paginated_sales
