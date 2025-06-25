import React, { useState, useEffect } from "react";
import api from "../services/api";
import SaleCard from "./ClientSales/SaleCard";
import SalesSummary from "./ClientSales/SalesSummary";
import PaginationControls from "./ClientSales/PaginationControls";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  sales_id?: string;
  sale_id?: string;
  total_tax_incl?: number;
  total?: number;
  date?: string;
  products?: Product[];
}

interface Client {
  id?: string;
  customers_id?: string;
  first_name: string;
  last_name: string;
}

const ClientSales: React.FC<{ client: Client | null }> = ({ client }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 5;

  useEffect(() => {
    if (!client) return;

    const fetchSalesData = async () => {
      setLoading(true);
      setError("");
      try {
        const clientId = client.customers_id || client.id;
        if (!clientId) throw new Error("Client ID not found");
        const response = await api.get<Sale[]>(`/clients/${clientId}/sales`);
        setSales(response.data);
        setCurrentPage(1);
      } catch (err) {
        setError("Failed to load sales data");
        console.error("Sales loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [client?.customers_id, client?.id]);

  if (!client) return null;

  const totalPages = Math.ceil(sales.length / salesPerPage);
  const currentSales = sales.slice((currentPage - 1) * salesPerPage, currentPage * salesPerPage);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>
        Sales for {client.first_name} {client.last_name}
      </h2>

      {loading && <p>Loading sales data...</p>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          <SalesSummary sales={sales} />

          {sales.length === 0 ? (
            <p style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No sales found for this client.
            </p>
          ) : (
            <>
              <div className="sales-grid">
                {currentSales.map((sale, index) => (
                  <SaleCard key={index} sale={sale} index={index} />
                ))}
              </div>

              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClientSales;
