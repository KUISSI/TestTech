import React from "react";
import ClientSearch from "../ClientSearch";
import ClientSales from "../ClientSales";

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
  onSearch: (name: string) => void;
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const DashboardContent: React.FC<Props> = ({
  clients,
  loading,
  onSearch,
  selectedClient,
  onClientSelect,
}) => (
  <>
    <div className="card">
      <ClientSearch
        onSearch={onSearch}
        clients={clients}
        loading={loading}
        selectedClient={selectedClient}
        onClientSelect={onClientSelect}
      />
    </div>

    {selectedClient && (
      <div className="card">
        <ClientSales client={selectedClient} />
      </div>
    )}
  </>
);

export default DashboardContent;
