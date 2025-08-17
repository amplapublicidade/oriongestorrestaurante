import React from 'react';
import { DEMO_MODE } from '../config/demoMode';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const DemoBanner = () => {
  if (!DEMO_MODE) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-blue-100">
              <InformationCircleIcon className="h-6 w-6 text-blue-600" />
            </span>
            <p className="ml-3 font-medium text-blue-900">
              <span className="md:hidden">Modo Demo Ativo</span>
              <span className="hidden md:inline">
                🎭 Modo Demo Ativo - Esta é uma demonstração com dados simulados. 
                O backend não está conectado. Use qualquer email/senha para fazer login.
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <a
              href="https://github.com/amplapublicidade/oriongestorrestaurante"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
            >
              Ver Código
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner; 