import React, { useState, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("testuser");
  const [password, setPassword] = useState<string>("testpass");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "100px auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          Login to LittleBill
        </h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              autoComplete="username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: "#f8f9fa",
            borderRadius: 4,
          }}
        >
          <h4 style={{ fontSize: 14, marginBottom: 8 }}>Test Credentials:</h4>
          <p style={{ fontSize: 12, color: "#666" }}>Username: testuser</p>
          <p style={{ fontSize: 12, color: "#666" }}>Password: testpass</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
