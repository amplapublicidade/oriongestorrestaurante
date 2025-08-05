import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import api from '../config/axios';
import toast from 'react-hot-toast';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState(null);

  // Carregar dados do relatório
  useEffect(() => {
    loadReportData();
  }, [reportType, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/${reportType}?range=${dateRange}`);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      toast.error('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  // Dados mock para demonstração
  const mockData = {
    inventory: {
      totalProducts: 142,
      lowStock: 8,
      outOfStock: 3,
      totalValue: 47352.50,
      topProducts: [
        { name: 'Arroz', stock: 150, value: 4500 },
        { name: 'Feijão', stock: 120, value: 3600 },
        { name: 'Óleo', stock: 80, value: 2400 },
        { name: 'Farinha', stock: 200, value: 2000 },
        { name: 'Açúcar', stock: 100, value: 1500 }
      ],
      categories: [
        { name: 'Grãos', count: 45, value: 15000 },
        { name: 'Hortifruti', count: 38, value: 12000 },
        { name: 'Carnes', count: 25, value: 8000 },
        { name: 'Laticínios', count: 20, value: 6000 },
        { name: 'Outros', count: 14, value: 6352.50 }
      ]
    },
    suppliers: {
      totalSuppliers: 23,
      activeSuppliers: 20,
      totalOrders: 156,
      totalSpent: 125000,
      topSuppliers: [
        { name: 'Hortifruti Silva', orders: 45, spent: 25000 },
        { name: 'Distribuidora Grãos', orders: 38, spent: 22000 },
        { name: 'Açougue Central', orders: 32, spent: 18000 },
        { name: 'Laticínios Premium', orders: 28, spent: 15000 },
        { name: 'Bebidas Express', orders: 13, spent: 8000 }
      ]
    },
    movements: {
      totalMovements: 342,
      entries: 245,
      exits: 97,
      totalValue: 89000,
      recentMovements: [
        { product: 'Tomate', type: 'in', quantity: 50, date: '2025-01-27' },
        { product: 'Arroz', type: 'out', quantity: 20, date: '2025-01-27' },
        { product: 'Óleo', type: 'in', quantity: 30, date: '2025-01-26' },
        { product: 'Feijão', type: 'out', quantity: 15, date: '2025-01-26' },
        { product: 'Farinha', type: 'in', quantity: 100, date: '2025-01-25' }
      ]
    }
  };

  // Exportar relatório
  const exportReport = (format = 'pdf') => {
    toast.success(`Relatório exportado em ${format.toUpperCase()}`);
    // Aqui seria implementada a lógica real de exportação
  };

  // Renderizar gráfico simples de barras
  const renderBarChart = (data, title, color = 'blue') => {
    const maxValue = Math.max(...data.map(item => item.value || item.count || item.stock));
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${((item.value || item.count || item.stock) / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-500 w-16 text-right">
              {item.value ? `R$ ${item.value.toLocaleString()}` : 
               item.count ? item.count : item.stock}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const currentData = mockData[reportType] || mockData.inventory;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Análises e relatórios detalhados do restaurante
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => exportReport('pdf')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Excel
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="inventory">Inventário</option>
                <option value="suppliers">Fornecedores</option>
                <option value="movements">Movimentações</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último ano</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando relatório...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Estatísticas Principais */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {reportType === 'inventory' && (
                <>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ArchiveBoxIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total de Produtos
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.totalProducts}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Estoque Baixo
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.lowStock}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ArchiveBoxIcon className="h-6 w-6 text-red-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Sem Estoque
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.outOfStock}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Valor Total
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              R$ {currentData.totalValue.toLocaleString()}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {reportType === 'suppliers' && (
                <>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BuildingStorefrontIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total de Fornecedores
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.totalSuppliers}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BuildingStorefrontIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Fornecedores Ativos
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.activeSuppliers}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total de Pedidos
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.totalOrders}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Gasto
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              R$ {currentData.totalSpent.toLocaleString()}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {reportType === 'movements' && (
                <>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ArchiveBoxIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total de Movimentações
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.totalMovements}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ArrowDownTrayIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Entradas
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.entries}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ArrowDownTrayIcon className="h-6 w-6 text-red-400 rotate-180" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Saídas
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentData.exits}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Valor Total
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              R$ {currentData.totalValue.toLocaleString()}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Gráficos e Tabelas */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Gráfico Principal */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {reportType === 'inventory' && 'Produtos por Categoria'}
                  {reportType === 'suppliers' && 'Top Fornecedores'}
                  {reportType === 'movements' && 'Movimentações Recentes'}
                </h3>
                {reportType === 'inventory' && renderBarChart(currentData.categories, 'Valor por Categoria', 'blue')}
                {reportType === 'suppliers' && renderBarChart(currentData.topSuppliers, 'Gastos por Fornecedor', 'green')}
                {reportType === 'movements' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Últimas Movimentações</h4>
                    {currentData.recentMovements.map((movement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{movement.product}</p>
                          <p className="text-xs text-gray-500">{movement.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabela Detalhada */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {reportType === 'inventory' && 'Top Produtos'}
                  {reportType === 'suppliers' && 'Detalhes dos Fornecedores'}
                  {reportType === 'movements' && 'Resumo de Movimentações'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {reportType === 'inventory' && (
                          <>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                          </>
                        )}
                        {reportType === 'suppliers' && (
                          <>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fornecedor</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gasto</th>
                          </>
                        )}
                        {reportType === 'movements' && (
                          <>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentual</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportType === 'inventory' && currentData.topProducts.map((product, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{product.name}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{product.stock}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">R$ {product.value.toLocaleString()}</td>
                        </tr>
                      ))}
                      {reportType === 'suppliers' && currentData.topSuppliers.map((supplier, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm text-gray-900">{supplier.name}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{supplier.orders}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">R$ {supplier.spent.toLocaleString()}</td>
                        </tr>
                      ))}
                      {reportType === 'movements' && (
                        <>
                          <tr>
                            <td className="px-3 py-2 text-sm text-gray-900">Entradas</td>
                            <td className="px-3 py-2 text-sm text-gray-500">{currentData.entries}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{((currentData.entries / currentData.totalMovements) * 100).toFixed(1)}%</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 text-sm text-gray-900">Saídas</td>
                            <td className="px-3 py-2 text-sm text-gray-500">{currentData.exits}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{((currentData.exits / currentData.totalMovements) * 100).toFixed(1)}%</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports; 