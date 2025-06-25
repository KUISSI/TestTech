import pytest

@pytest.fixture
def headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}

def test_search_clients(client, headers):
    response = client.get("/clients?name=Dupont", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["last_name"] == "Dupont"

def test_search_clients_no_result(client, headers):
    response = client.get("/clients?name=NonExistent", headers=headers)
    assert response.status_code == 200
    assert response.json() == []

def test_sync_customers(client, headers):
    from unittest.mock import patch, MagicMock, AsyncMock

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [{"id": 10, "last_name": "Synced", "first_name": "User"}]
    mock_response.raise_for_status.return_value = None

    with patch('app.api.httpx.AsyncClient') as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

        response = client.post("/sync_customers", headers=headers)
        assert response.status_code == 200
        assert response.json() == {"message": "Successfully synced 1 customers."}

        response = client.get("/clients?name=Synced", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["last_name"] == "Synced"
