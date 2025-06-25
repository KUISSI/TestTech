import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardHeader from "./Dashboard/DashboardHeader";
import DashboardContent from "./Dashboard/DashboardContent";
import api from "../services/api";

function Dashboard() {
  const { user, logout } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <div>Loading...</div>;

  const searchClients = async (name: string) => {
    if (!name.trim()) return setClients([]);
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/clients?name=${encodeURIComponent(name)}`);
      setClients(response.data);
    } catch {
      setError("Failed to search clients");
    }
    setLoading(false);
  };

  const syncCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/sync_customers");
    } catch {
      setError("Failed to sync customers");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <DashboardHeader user={user} logout={logout} onSync={syncCustomers} loading={loading} />

      {error && <div className="alert alert-error">{error}</div>}

      <DashboardContent
        clients={clients}
        loading={loading}
        onSearch={searchClients}
        selectedClient={selectedClient}
        onClientSelect={setSelectedClient}
      />
    </div>
  );
}

export default Dashboard;
