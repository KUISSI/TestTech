from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    customers_id = Column(Integer, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    phone = Column(String)
    sales = relationship('Sale', back_populates='customer')

class Sale(Base):
    __tablename__ = 'sales'
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, index=True)
    total = Column(Float)
    total_tax_incl = Column(Float)
    date = Column(String)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    customer = relationship('Customer', back_populates='sales')
    products = Column(String)  # Store as JSON string if needed
