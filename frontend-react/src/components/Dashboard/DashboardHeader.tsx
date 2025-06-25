import React from "react";

interface Props {
  user: { username: string };
  logout: () => void;
  onSync: () => void;
  loading: boolean;
}

const DashboardHeader: React.FC<Props> = ({ user, logout, onSync, loading }) => (
  <div className="header">
    <h1>LittleBill Dashboard</h1>
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <span style={{ color: "#666" }}>Welcome, {user.username}</span>
      <button onClick={onSync} className="btn btn-secondary" disabled={loading}>
        Sync Customers
      </button>
      <button onClick={logout} className="btn btn-danger">
        Logout
      </button>
    </div>
  </div>
);

export default DashboardHeader;
