import pytest
import json
import os
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.auth import get_password_hash

TEST_CUSTOMERS = [
    {"id": 1, "last_name": "Dupont", "first_name": "Jean"},
    {"id": 2, "last_name": "Martin", "first_name": "Marie"},
]

TEST_SALES = {
    "1": [{"sale_id": 101, "total": 50.0}, {"sale_id": 102, "total": 75.5}],
    "2": [{"sale_id": 103, "total": 120.0}],
}

TEST_USER = {"username": "testuser", "password": "testpassword"}
TEST_USER_HASHED_PASSWORD = get_password_hash(TEST_USER["password"])
TEST_USERS_DATA = [
    {"username": TEST_USER["username"], "hashed_password": TEST_USER_HASHED_PASSWORD}
]

@pytest.fixture(autouse=True)
def mock_data_files(tmp_path):
    data_dir = tmp_path / "data"
    data_dir.mkdir()

    (data_dir / "customers.json").write_text(json.dumps(TEST_CUSTOMERS))
    (data_dir / "sales.json").write_text(json.dumps(TEST_SALES))
    (data_dir / "users.json").write_text(json.dumps(TEST_USERS_DATA))

    with patch("app.api.CUSTOMERS_FILE", data_dir / "customers.json"), \
         patch("app.api.SALES_FILE", data_dir / "sales.json"), \
         patch("app.auth.USERS_FILE", data_dir / "users.json"):
        yield

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)

@pytest.fixture
def auth_token(client):
    response = client.post("/token", data={"username": TEST_USER["username"], "password": TEST_USER["password"]})
    assert response.status_code == 200
    return response.json()["access_token"]
