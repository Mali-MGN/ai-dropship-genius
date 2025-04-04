import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import Settings from '@/pages/Settings';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { VerifyEmail } from '@/pages/VerifyEmail';
import Analytics from '@/pages/Analytics';
import IntegratedProductDiscovery from '@/pages/IntegratedProductDiscovery';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from './components/ui/toaster';

// Placeholder Customers page
const Customers = () => (
  <MainLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer relationships</p>
      </div>
      <div className="border rounded-md p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">Customer management tools are currently under development.</p>
      </div>
    </div>
  </MainLayout>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/ai-product-discovery" element={<PrivateRoute><IntegratedProductDiscovery /></PrivateRoute>} />
          <Route path="/product-discovery" element={<Navigate to="/ai-product-discovery" replace />} />
          <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/orders/:orderId" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default App;
