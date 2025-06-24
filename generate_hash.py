from passlib.context import CryptContext
import sys
import getpass

def generate_hash(password=None):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    if not password:
        password = getpass.getpass("Enter password to hash: ")
    hashed = pwd_context.hash(password)
    print("\nGenerated hash:")
    print(hashed)
    print("\nCopy this hash in app/auth.py for the user.")

if __name__ == "__main__":
    pwd = sys.argv[1] if len(sys.argv) > 1 else None
    generate_hash(pwd)
