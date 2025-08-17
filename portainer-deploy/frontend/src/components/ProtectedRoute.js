import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige roles específicas, verifica se o usuário tem permissão
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Pode redirecionar para uma página de "Acesso Negado" ou para a home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;