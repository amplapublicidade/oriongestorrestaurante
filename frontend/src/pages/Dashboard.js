import React from 'react';
import Layout from '../components/Layout';
import {
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  // Dados mock para demonstração
  const stats = [
    {
      name: 'Total de Produtos',
      value: '142',
      change: '+12%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Fornecedores Ativos',
      value: '23',
      change: '+2',
      changeType: 'increase',
      icon: BuildingStorefrontIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Itens em Estoque',
      value: '1,847',
      change: '-5%',
      changeType: 'decrease',
      icon: ArchiveBoxIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Valor Total',
      value: 'R$ 47.352',
      change: '+18%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    }
  ];

  const lowStockItems = [
    { name: 'Tomate', currentStock: 5, minStock: 20, unit: 'kg' },
    { name: 'Arroz', currentStock: 12, minStock: 50, unit: 'kg' },
    { name: 'Óleo de Soja', currentStock: 3, minStock: 10, unit: 'L' },
    { name: 'Cebola', currentStock: 8, minStock: 15, unit: 'kg' },
  ];

  const recentOrders = [
    { id: '#001', supplier: 'Hortifruti Silva', total: 'R$ 450,00', status: 'Entregue', date: '2025-01-27' },
    { id: '#002', supplier: 'Distribuidora Grãos', total: 'R$ 1.200,00', status: 'Pendente', date: '2025-01-26' },
    { id: '#003', supplier: 'Açougue Central', total: 'R$ 850,00', status: 'Entregue', date: '2025-01-25' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.changeType === 'increase' ? (
                            <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                          )}
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Low Stock Alert */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Alertas de Estoque Baixo
                </h3>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Estoque: {item.currentStock} {item.unit} / Mínimo: {item.minStock} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Baixo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Ver todos os alertas →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Pedidos Recentes
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.supplier}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.total}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Entregue'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Ver todos os pedidos →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Ações Rápidas
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="flex flex-col items-center p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <ShoppingBagIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">Novo Produto</span>
              </button>
              
              <button className="flex flex-col items-center p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <BuildingStorefrontIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">Novo Fornecedor</span>
              </button>
              
              <button className="flex flex-col items-center p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <ArchiveBoxIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">Atualizar Estoque</span>
              </button>
              
              <button className="flex flex-col items-center p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">Novo Pedido</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 