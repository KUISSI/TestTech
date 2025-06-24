import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ClientSearch from "./ClientSearch";
import ClientSales from "./ClientSales";
import api from "../services/api";

interface Client {
  id?: string;
  customers_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!user) {
    return <div>Loading...</div>;
  }

  const searchClients = async (name: string) => {
    if (!name.trim()) {
      setClients([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get<Client[]>(`/clients?name=${encodeURIComponent(name)}`);
      setClients(response.data);
    } catch (err) {
      setError("Failed to search clients");
      console.error("Search error:", err);
    }

    setLoading(false);
  };

  const syncCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      await api.post("/sync_customers");
    } catch (err) {
      setError("Failed to sync customers");
      console.error("Sync error:", err);
    }

    setLoading(false);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>LittleBill Dashboard</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ color: "#666" }}>Welcome, {user?.username}</span>
          <button onClick={syncCustomers} className="btn btn-secondary" disabled={loading}>
            Sync Customers
          </button>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <ClientSearch
          onSearch={searchClients}
          clients={clients}
          loading={loading}
          onClientSelect={handleClientSelect}
          selectedClient={selectedClient}
        />
      </div>

      {selectedClient && (
        <div className="card">
          <ClientSales client={selectedClient} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
