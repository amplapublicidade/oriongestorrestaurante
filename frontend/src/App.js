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
import Users from './pages/Users';
import SupplierTypes from './pages/SupplierTypes';
import SupplierContracts from './pages/SupplierContracts';
import Orders from './pages/Orders';
import SendSupplier from './pages/SendSupplier';
import SalesManage from './pages/SalesManage';
import SalesGoals from './pages/SalesGoals';
import CashFlow from './pages/CashFlow';
import AccountsPayable from './pages/AccountsPayable';
import FinancialReports from './pages/FinancialReports';
import Backup from './pages/Backup';
import SettingsPage from './pages/Settings';
import SystemLogs from './pages/SystemLogs';

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
              <Route path="/filiais" element={<ProtectedRoute><OrionLayout><Branches /></OrionLayout></ProtectedRoute>} />
              <Route path="/colaboradores" element={<ProtectedRoute><OrionLayout><Users /></OrionLayout></ProtectedRoute>} />
              <Route path="/supplier-types" element={<ProtectedRoute><OrionLayout><SupplierTypes /></OrionLayout></ProtectedRoute>} />
              <Route path="/supplier-contracts" element={<ProtectedRoute><OrionLayout><SupplierContracts /></OrionLayout></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrionLayout><Orders /></OrionLayout></ProtectedRoute>} />
              <Route path="/send-supplier" element={<ProtectedRoute><OrionLayout><SendSupplier /></OrionLayout></ProtectedRoute>} />
              <Route path="/sales-manage" element={<ProtectedRoute><OrionLayout><SalesManage /></OrionLayout></ProtectedRoute>} />
              <Route path="/sales-goals" element={<ProtectedRoute><OrionLayout><SalesGoals /></OrionLayout></ProtectedRoute>} />
              <Route path="/cash-flow" element={<ProtectedRoute><OrionLayout><CashFlow /></OrionLayout></ProtectedRoute>} />
              <Route path="/accounts-payable" element={<ProtectedRoute><OrionLayout><AccountsPayable /></OrionLayout></ProtectedRoute>} />
              <Route path="/financial-reports" element={<ProtectedRoute><OrionLayout><FinancialReports /></OrionLayout></ProtectedRoute>} />
              <Route path="/backup" element={<ProtectedRoute><OrionLayout><Backup /></OrionLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><OrionLayout><SettingsPage /></OrionLayout></ProtectedRoute>} />
              <Route path="/system-logs" element={<ProtectedRoute><OrionLayout><SystemLogs /></OrionLayout></ProtectedRoute>} />
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