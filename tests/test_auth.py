import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)

def test_login_for_access_token(client):
    response = client.post("/token", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_for_access_token_invalid_credentials(client):
    response = client.post("/token", data={"username": "testuser", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

def test_access_protected_without_token(client):
    response = client.get("/users/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_read_users_me(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json() == {"username": "testuser"}
