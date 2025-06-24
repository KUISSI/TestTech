import React, { useState, useEffect } from "react";
import api from "../services/api";

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

interface ClientSalesProps {
  client: Client | null;
}

const ClientSales: React.FC<ClientSalesProps> = ({ client }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [salesPerPage] = useState<number>(5);

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
        console.error("Sales loading error:", err);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [client?.customers_id, client?.id]);

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(sales.length / salesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR");
    } catch {
      return dateString;
    }
  };

  if (!client) return null;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>
        Sales for {client.first_name} {client.last_name}
      </h2>

      {loading && (
        <div className="loading">
          <p>Loading sales data...</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          {sales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No sales found for this client.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "20px", color: "#666" }}>
                <p>Total sales: {sales.length}</p>
                <p>
                  Total amount:{" "}
                  {formatCurrency(
                    sales.reduce(
                      (sum, sale) =>
                        sum + (sale.total_tax_incl || sale.total || 0),
                      0
                    )
                  )}
                </p>
              </div>

              <div className="sales-grid">
                {currentSales.map((sale, index) => (
                  <div
                    key={sale.sales_id || sale.sale_id || `sale-${index}`}
                    className="sale-item"
                  >
                    <h4>Sale #{sale.sales_id || sale.sale_id || index + 1}</h4>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {formatCurrency(sale.total_tax_incl || sale.total || 0)}
                    </p>
                    {sale.date && (
                      <p>
                        <strong>Date:</strong> {formatDate(sale.date)}
                      </p>
                    )}
                    {sale.products && sale.products.length > 0 && (
                      <p>
                        <strong>Items:</strong> {sale.products.length} product(s)
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>

                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClientSales;
