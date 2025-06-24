import React, { useState, useEffect } from "react";
import api from "../services/api";

function ClientSales({ client }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(5);

  useEffect(() => {
    if (!client) return;

    const fetchSalesData = async () => {
      setLoading(true);
      setError("");

      try {
        const clientId = client.customers_id || client.id;
        const response = await api.get(`/clients/${clientId}/sales`);
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
  }, [client?.customers_id, client?.id]); // Seules les dépendances nécessaires
  // Calculate pagination

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR");
    } catch {
      return dateString;
    }
  };

  if (!client) {
    return null;
  }

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
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
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
                        sum + +(sale.total_tax_incl || sale.total || 0),
                      0
                    )
                  )}
                </p>
              </div>

              <div className="sales-grid">
                {currentSales.map((sale, index) => (
                  <div
                    key={sale.sales_id || sale.sale_id || index}
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
                        <strong>Items:</strong> {sale.products.length}{" "}
                        product(s)
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
}

export default ClientSales;
