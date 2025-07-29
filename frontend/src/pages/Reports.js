import React from 'react';
import Layout from '../components/Layout';
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análises e relatórios do restaurante</p>
          </div>
          <button className="btn-primary flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Gerar Relatório
          </button>
        </div>

        {/* Content */}
        <div className="card p-8 text-center">
          <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Página de Relatórios em Desenvolvimento
          </h3>
          <p className="text-gray-600 mb-6">
            Esta página será implementada para gerar relatórios e análises.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✅ Backend API criado</p>
            <p>🚧 Interface em desenvolvimento</p>
            <p>📋 Funcionalidades: Gráficos, exportar PDF, filtros</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports; 