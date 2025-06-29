import React, { useState } from 'react';

interface Client {
  customers_id?: number;
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface ClientSearchProps {
  onSearch: (searchTerm: string) => void;
  clients: Client[];
  loading: boolean;
  onClientSelect: (client: Client) => void;
  selectedClient?: Client | null;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ onSearch, clients, loading, onClientSelect, selectedClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      onSearch(value);
    } else if (value.length === 0) {
      onSearch('');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Search Clients</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label htmlFor="search">Client Name</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Enter client name to search..."
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !searchTerm.trim()}
            >
              Search
            </button>
          </div>
        </div>
      </form>
      {loading && (
        <div className="loading">
          <p>Searching for clients...</p>
        </div>
      )}
      {!loading && clients.length > 0 && (
        <div>
          <h3>Search Results ({clients.length} found)</h3>
          <ul className="client-list">
            {clients.map((client) => (
              <li
                key={client.customers_id || client.id}
                className={`client-item ${selectedClient?.customers_id === client.customers_id ? 'selected' : ''}`}
                onClick={() => onClientSelect(client)}
              >
                <div>
                  <strong>
                    {client.first_name} {client.last_name}
                  </strong>
                </div>
                {client.email && (
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    Email: {client.email}
                  </div>
                )}
                {client.phone && (
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    Phone: {client.phone}
                  </div>
                )}
                <div style={{ color: '#999', fontSize: '12px' }}>
                  ID: {client.customers_id || client.id}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && searchTerm && clients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No clients found for "{searchTerm}"</p>
          <p style={{ fontSize: '14px' }}>Try a different search term or sync customers from Hiboutik.</p>
        </div>
      )}
    </div>
  );
};

export default ClientSearch;
