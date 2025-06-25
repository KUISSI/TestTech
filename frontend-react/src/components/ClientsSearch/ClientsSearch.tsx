import React, { useState } from "react";
import ClientSearchForm from "./ClientSearch/ClientSearchForm";
import ClientSearchResults from "./ClientSearch/ClientSearchResults";

interface Client {
  id?: string;
  customers_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface Props {
  onSearch: (name: string) => void;
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
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <h2>Search Clients</h2>

      <ClientSearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
        loading={loading}
      />

      <ClientSearchResults
        clients={clients}
        loading={loading}
        searchTerm={searchTerm}
        selectedClient={selectedClient}
        onClientSelect={onClientSelect}
      />
    </div>
  );
};

export default ClientSearch;
