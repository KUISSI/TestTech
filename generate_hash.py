from passlib.context import CryptContext
import getpass

def generate_hash():
    """Generates a bcrypt hash for a given password."""
    try:
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        password = getpass.getpass("Enter password to hash (e.g., testpass): ")
        hashed_password = pwd_context.hash(password)
        print("\nGenerated Hash:")
        print(hashed_password)
        print("\nCopy this hash and paste it into your app/auth.py file for the 'testuser'.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_hash()
