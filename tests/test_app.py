import pytest
from fastapi.testclient import TestClient
import json
import os
from unittest.mock import patch, MagicMock, AsyncMock

# Add the project root to the path to allow imports from 'app'
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.auth import get_password_hash

# Use a test client
client = TestClient(app)

# --- Test Data ---
TEST_CUSTOMERS = [
    {"id": 1, "last_name": "Dupont", "first_name": "Jean"},
    {"id": 2, "last_name": "Martin", "first_name": "Marie"},
]

TEST_SALES = {
    "1": [{"sale_id": 101, "total": 50.0}, {"sale_id": 102, "total": 75.5}],
    "2": [{"sale_id": 103, "total": 120.0}],
}

TEST_USER = {
    "username": "testuser",
    "password": "testpassword"
}
TEST_USER_HASHED_PASSWORD = get_password_hash(TEST_USER["password"])
TEST_USERS_DATA = [
    {"username": TEST_USER["username"], "hashed_password": TEST_USER_HASHED_PASSWORD}
]

# --- Mocks and Fixtures ---

@pytest.fixture(autouse=True)
def mock_data_files(tmp_path):
    """Mocks the JSON data files for the duration of a test."""
    data_dir = tmp_path / "data"
    data_dir.mkdir()

    customers_file = data_dir / "customers.json"
    customers_file.write_text(json.dumps(TEST_CUSTOMERS))

    sales_file = data_dir / "sales.json"
    sales_file.write_text(json.dumps(TEST_SALES))

    users_file = data_dir / "users.json"
    users_file.write_text(json.dumps(TEST_USERS_DATA))

    # Use patch to point the application to the temporary data files
    with patch('app.api.CUSTOMERS_FILE', customers_file), \
         patch('app.api.SALES_FILE', sales_file), \
         patch('app.auth.USERS_FILE', users_file):
        yield

@pytest.fixture
def auth_token():
    """Provides a valid authentication token for tests."""
    response = client.post("/token", data={"username": TEST_USER["username"], "password": TEST_USER["password"]})
    assert response.status_code == 200
    return response.json()["access_token"]

# --- Test Cases ---

def test_read_main():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "LittleBill Tech Test API running"}

def test_login_for_access_token():
    """Test the /token endpoint for user login."""
    response = client.post("/token", data={"username": TEST_USER["username"], "password": TEST_USER["password"]})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_for_access_token_invalid_credentials():
    """Test login with wrong password."""
    response = client.post("/token", data={"username": TEST_USER["username"], "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

def test_read_users_me(auth_token):
    """Test the protected /users/me endpoint."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json() == {"username": TEST_USER["username"]}

def test_search_clients(auth_token):
    """Test searching for clients by name."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/clients?name=Dupont", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["last_name"] == "Dupont"

def test_search_clients_no_result(auth_token):
    """Test searching for a client that does not exist."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/clients?name=NonExistent", headers=headers)
    assert response.status_code == 200
    assert response.json() == []

def test_get_client_sales(auth_token):
    """Test getting all sales for a specific client."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/clients/1/sales", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["total"] == 50.0

def test_get_client_sales_no_sales(auth_token):
    """Test getting sales for a client with no sales record."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Mock the external API call to return no sales
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [] # Simulate no sales
    mock_response.raise_for_status.return_value = None

    with patch('app.api.httpx.AsyncClient') as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
        
        # Client 3 is not in the mocked TEST_SALES, so this will trigger an API call
        response = client.get("/clients/3/sales", headers=headers)
        assert response.status_code == 200
        assert response.json() == []

def test_get_client_sales_paginated(auth_token):
    """Test getting paginated sales for a client."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/clients/1/sales_paginated?page=1&size=1", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["sale_id"] == 101

    response = client.get("/clients/1/sales_paginated?page=2&size=1", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["sale_id"] == 102

def test_sync_customers(auth_token):
    """Test the /sync_customers endpoint."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Mock the external API call
    mock_hiboutik_data = [{"id": 10, "last_name": "Synced", "first_name": "User"}]
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_hiboutik_data
    mock_response.raise_for_status.return_value = None

    with patch('app.api.httpx.AsyncClient') as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

        response = client.post("/sync_customers", headers=headers)
        assert response.status_code == 200
        assert response.json() == {"message": "Successfully synced 1 customers."}

        # Verify the data was written to the file
        response = client.get("/clients?name=Synced", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["last_name"] == "Synced"
