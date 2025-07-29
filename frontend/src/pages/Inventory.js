import React from 'react';
import Layout from '../components/Layout';
import { ArchiveBoxIcon, PlusIcon } from '@heroicons/react/24/outline';

const Inventory = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
            <p className="text-gray-600">Controle total do estoque do restaurante</p>
          </div>
          <button className="btn-primary flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Atualizar Estoque
          </button>
        </div>

        {/* Content */}
        <div className="card p-8 text-center">
          <ArchiveBoxIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Página de Estoque em Desenvolvimento
          </h3>
          <p className="text-gray-600 mb-6">
            Esta página será implementada para controle completo do estoque.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✅ Backend API criado</p>
            <p>🚧 Interface em desenvolvimento</p>
            <p>📋 Funcionalidades: Entradas, saídas, alertas</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory; 