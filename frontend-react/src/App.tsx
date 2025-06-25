import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Composant principal de l'application
function App(): JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Composant de route pour la page de login
function LoginRoute(): JSX.Element {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
}

// Composant de protection de route
function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default App;
