from app.database import init_db, SessionLocal
from app.models import User
from passlib.context import CryptContext

# Only run this script to migrate users from users.json to the database
import json
from pathlib import Path

USERS_FILE = Path("data") / "users.json"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def migrate_users():
    if not USERS_FILE.exists():
        print("No users.json file found.")
        return
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        users_list = json.load(f)
    db = SessionLocal()
    for user in users_list:
        if not db.query(User).filter(User.username == user["username"]).first():
            db_user = User(username=user["username"], hashed_password=user["hashed_password"])
            db.add(db_user)
    db.commit()
    db.close()
    print(f"Migrated {len(users_list)} users to the database.")

if __name__ == "__main__":
    init_db()
    migrate_users()
