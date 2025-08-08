import axios from 'axios';
import { DEMO_MODE, DEMO_DATA, simulateApiDelay, simulateRandomError } from './demoMode';

// Configuração base do axios
// A URL da API agora é definida por uma variável de ambiente padrão (Create React App).
// Isso é mais seguro e flexível, permitindo configurações diferentes para produção e desenvolvimento.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Modo demo - interceptar requisições
    if (DEMO_MODE) {
      await simulateApiDelay();
      
      if (simulateRandomError()) {
        throw new axios.Cancel('Erro simulado em modo demo');
      }

      // Simular respostas baseadas na URL
      const url = config.url;
      const method = config.method?.toLowerCase();
      
      if (url?.includes('/products')) {
        if (method === 'get') {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                products: DEMO_DATA.products,
                totalPages: 1,
                currentPage: 1,
                total: DEMO_DATA.products.length
              }
            }
          });
        }
      }
      
      if (url?.includes('/suppliers')) {
        if (method === 'get') {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                suppliers: DEMO_DATA.suppliers,
                totalPages: 1,
                currentPage: 1,
                total: DEMO_DATA.suppliers.length
              }
            }
          });
        }
      }
      
      if (url?.includes('/orders')) {
        if (method === 'get') {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                orders: DEMO_DATA.orders,
                totalPages: 1,
                currentPage: 1,
                total: DEMO_DATA.orders.length
              }
            }
          });
        }
      }
      
      if (url?.includes('/inventory')) {
        if (method === 'get') {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                movements: DEMO_DATA.inventoryMovements,
                totalPages: 1,
                currentPage: 1,
                total: DEMO_DATA.inventoryMovements.length
              }
            }
          });
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 