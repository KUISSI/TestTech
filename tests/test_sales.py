import pytest
from unittest.mock import patch, MagicMock, AsyncMock

def test_get_client_sales(client, headers):
    response = client.get("/clients/1/sales", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["total"] == 50.0

def test_get_client_sales_no_sales(client, headers):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = []
    mock_response.raise_for_status.return_value = None

    with patch("app.api.httpx.AsyncClient") as mock_client:
        mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
        response = client.get("/clients/3/sales", headers=headers)
        assert response.status_code == 200
        assert response.json() == []

def test_get_client_sales_paginated(client, headers):
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
