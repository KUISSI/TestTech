from app.database import init_db, SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(username, password):
    db = SessionLocal()
    hashed_password = pwd_context.hash(password)
    user = User(username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.close()
    print(f"User '{username}' created.")

if __name__ == "__main__":
    init_db()
    create_user("testuser", "testpass")
