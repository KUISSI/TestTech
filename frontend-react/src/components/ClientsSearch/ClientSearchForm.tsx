import React, { useEffect, useRef } from "react";

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (name: string) => void;
  loading: boolean;
}

const ClientSearchForm: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  loading,
}) => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.length >= 2 || value.length === 0) {
        onSearch(value);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) onSearch(searchTerm.trim());
  };

  return (
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
  );
};

export default ClientSearchForm;
