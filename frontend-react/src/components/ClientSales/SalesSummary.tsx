import React from "react";

interface Sale {
  total_tax_incl?: number;
  total?: number;
}

const SalesSummary: React.FC<{ sales: Sale[] }> = ({ sales }) => {
  const total = sales.reduce(
    (sum, s) => sum + +(s.total_tax_incl || s.total || 0),
    0
  );

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  return (
    <div style={{ marginBottom: 20, color: "#666" }}>
      <p>Total sales: {sales.length}</p>
      <p>Total amount: {formatCurrency(total)}</p>
    </div>
  );
};

export default SalesSummary;
