from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from app.auth import authenticate_user, create_access_token, get_current_user
from app.database import init_db
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

app = FastAPI(title="LittleBill API",
              description="Client and Sales Management API")

init_db()  # Initialize DB on startup

# Pydantic model for the token response


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str


# CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes API depuis app/api.py
app.include_router(api_router)

ACCESS_TOKEN_EXPIRE_MINUTES = 30


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


@app.get("/")
def root():
    return {"message": "LittleBill API running", "docs": "/docs"}
