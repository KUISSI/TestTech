import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClientSearch from './ClientSearch';
import ClientSales from './ClientSales';
import api from '../services/api';

interface Client {
  customers_id?: number;
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState('');

  if (!user) {
    return <div>Loading...</div>;
  }

  const searchClients = async (name: string) => {
    if (!name.trim()) {
      setClients([]);
      setError('');
      setSyncSuccess(''); // Clear success on new search
      return;
    }
    setLoading(true);
    setError('');
    setSyncSuccess(''); // Clear success on new search
    try {
      const response = await api.get(`/clients?name=${encodeURIComponent(name)}`);
      setClients(response.data);
      setError('');
    } catch (err) {
      setError('Failed to search clients');
      setSyncSuccess(''); // Clear success on error
      console.error('Search error:', err);
    }
    setLoading(false);
  };

  const syncCustomers = async () => {
    setLoading(true);
    setError('');
    setSyncSuccess(''); // Clear previous success
    try {
      const response = await api.post('/sync_customers');
      if (!response || !response.data || !response.data.message) {
        setError('Failed to sync customers');
        setSyncSuccess('');
      } else {
        setError('');
        setSyncSuccess('Customers synced successfully!');
      }
    } catch (err: any) {
      if (err?.response?.config?.url?.includes('/sync_customers')) {
        setError('Failed to sync customers');
        setSyncSuccess('');
      } else {
        console.warn('Non-sync error ignored:', err);
      }
      console.error('Sync error:', err);
    }
    setLoading(false);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setError('');
    setSyncSuccess(''); // Clear success on client select
  };

  const handleLogout = () => {
    setError('');
    setSyncSuccess(''); // Clear success on logout
    logout();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>LittleBill Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>Welcome, {user?.username}</span>
          <button
            onClick={syncCustomers}
            className="btn btn-secondary"
            disabled={loading}
          >
            Sync Customers
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {syncSuccess && <div className="alert alert-success">{syncSuccess}</div>}
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
