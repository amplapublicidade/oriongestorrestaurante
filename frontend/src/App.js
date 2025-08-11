import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import DemoBanner from './components/DemoBanner';
import OrionLayout from './components/OrionLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Branches from './pages/Branches';

// Criar cliente React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
                    <Router>
            <div className="App">
              <DemoBanner />
              <Routes>
              {/* Rota pública */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <OrionLayout>
                      <Dashboard />
                    </OrionLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <OrionLayout>
                      <Products />
                    </OrionLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <OrionLayout>
                      <Suppliers />
                    </OrionLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <OrionLayout>
                      <Inventory />
                    </OrionLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <OrionLayout>
                      <Reports />
                    </OrionLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/filiais"
                element={
                  <ProtectedRoute>
                    <OrionLayout>
                      <Branches />
                    </OrionLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            
            {/* Notificações toast */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App; 