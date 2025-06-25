import React from "react";

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

const SaleCard: React.FC<{ sale: Sale; index: number }> = ({ sale, index }) => {
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

  return (
    <div className="sale-item">
      <h4>Sale #{sale.sales_id || sale.sale_id || index + 1}</h4>
      <p>
        <strong>Amount:</strong>{" "}
        {formatCurrency(+(sale.total_tax_incl || sale.total || 0))}
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
  );
};

export default SaleCard;
