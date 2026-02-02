
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import OrderManager from './components/OrderManager';
import MenuManager from './components/MenuManager';
import KDS from './components/KDS';
import CustomerManager from './components/CustomerManager';
import CouponManager from './components/CouponManager';
import ConfigManager from './components/ConfigManager';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="kds" element={<KDS />} />
            <Route path="customers" element={<CustomerManager />} />
            <Route path="coupons" element={<CouponManager />} />
            <Route path="settings" element={<ConfigManager />} />
            <Route path="delivery" element={<div>Reparto - Próximamente</div>} />
            <Route path="reports" element={<div>Reportes - Próximamente</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
