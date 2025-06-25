import React from "react";

interface Client {
  id?: string;
  customers_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface Props {
  clients: Client[];
  loading: boolean;
  searchTerm: string;
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const ClientSearchResults: React.FC<Props> = ({
  clients,
  loading,
  searchTerm,
  selectedClient,
  onClientSelect,
}) => {
  if (loading) return <p>Loading clients...</p>;

  if (!loading && searchTerm && clients.length === 0)
    return <p>No clients found for "{searchTerm}"</p>;

  return (
    <>
      {clients.length > 0 && (
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
    </>
  );
};

export default ClientSearchResults;
