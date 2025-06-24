import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Client {
  id?: string;
  customers_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface Props {
  onSearch: (term: string) => void;
  clients: Client[];
  loading: boolean;
  onClientSelect: (client: Client) => void;
  selectedClient: Client | null;
}

const ClientSearch: React.FC<Props> = ({
  onSearch,
  clients,
  loading,
  onClientSelect,
  selectedClient,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    setDebounceTimeout(
      setTimeout(() => {
        if (value.length >= 2 || value.length === 0) {
          onSearch(value);
        }
      }, 400)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) onSearch(searchTerm.trim());
  };

  return (
    <div>
      <h2>Search Clients</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label htmlFor="search">Client Name</label>
        <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
          <input
            id="search"
            type="text"
            placeholder="Enter client name..."
            value={searchTerm}
            onChange={handleInputChange}
            style={{ flex: 1, padding: "8px", fontSize: "14px" }}
          />
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p>Loading clients...</p>}

      {!loading && clients.length > 0 && (
        <>
          <h3>Results ({clients.length})</h3>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {clients.map((client) => (
              <li
                key={client.customers_id || client.id}
                onClick={() => onClientSelect(client)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  marginBottom: "8px",
                  backgroundColor:
                    selectedClient?.customers_id === client.customers_id
                      ? "#d0e7ff"
                      : "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <strong>
                  {client.first_name} {client.last_name}
                </strong>
                <br />
                {client.email && <small>Email: {client.email}</small>}
                <br />
                {client.phone && <small>Phone: {client.phone}</small>}
                <br />
                <small style={{ color: "#888" }}>
                  ID: {client.customers_id || client.id}
                </small>
              </li>
            ))}
          </ul>
        </>
      )}

      {!loading && searchTerm && clients.length === 0 && (
        <p>No clients found for "{searchTerm}"</p>
      )}
    </div>
  );
};

export default ClientSearch;
