# 📦 Orion Gestor de Restaurante

Sistema completo de gestão para restaurantes com controle de estoque, fornecedores, produtos e relatórios.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express.js** - API RESTful
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Express Validator** - Validação de dados

### Frontend
- **React 18** - Interface do usuário
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Heroicons** - Ícones
- **React Query** - Gerenciamento de estado
- **Axios** - Cliente HTTP

### DevOps
- **Docker** + **Docker Compose** - Containerização
- **Multi-stage builds** - Otimização de imagens

## 🛠️ Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)

### 🐳 Execução com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <repo-url>
cd orion-gestor-restaurante
```

2. **Execute com Docker Compose**
```bash
docker-compose up -d
```

3. **Acesse a aplicação**
- Frontend: http://localhost:8000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

4. **Popular banco de dados (primeira execução)**
```bash
docker exec orion-backend npm run seed
```

### 💻 Desenvolvimento Local

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 👤 Usuários de Teste

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@orion.com | 123456 | Administrador |
| gerente@orion.com | 123456 | Gerente |
| user@orion.com | 123456 | Usuário |

## 📊 Funcionalidades

### ✅ Implementado
- **Autenticação JWT** - Login/logout seguro
- **Dashboard** - Visão geral do sistema
- **Gestão de Usuários** - CRUD completo
- **Gestão de Produtos** - API completa
- **Gestão de Fornecedores** - Models e validações
- **Controle de Estoque** - Entradas/saídas
- **Interface Responsiva** - Desktop e mobile

### 🚧 Em Desenvolvimento
- Interface completa de produtos
- Interface de fornecedores
- Relatórios e gráficos
- Sistema de pedidos
- Notificações em tempo real

## 🏗️ Arquitetura

```
orion-gestor-restaurante/
├── backend/
│   ├── src/
│   │   ├── models/        # Modelos MongoDB
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   ├── seeds/         # Dados iniciais
│   │   └── server.js      # Servidor principal
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── contexts/      # Context API
│   │   └── App.js         # App principal
│   ├── Dockerfile
│   └── package.json
├── mongodb/
│   └── init/              # Scripts inicialização
├── docker-compose.yml
└── README.md
```

## 🔧 Comandos Úteis

### Docker
```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild imagens
docker-compose build --no-cache

# Popular banco de dados
docker exec orion-backend npm run seed
```

### Desenvolvimento
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start

# Testes
npm test

# Build produção
npm run build
```

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil do usuário

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Remover produto

### Fornecedores
- `GET /api/suppliers` - Listar fornecedores
- `POST /api/suppliers` - Criar fornecedor

## 🐛 Troubleshooting

### Erro "ECONNREFUSED MongoDB"
```bash
# Verificar se MongoDB está rodando
docker ps | grep mongo

# Restart dos serviços
docker-compose restart
```

### Frontend não carrega
```bash
# Verificar se build foi executado
docker exec orion-frontend ls -la build/

# Rebuild frontend
docker-compose build frontend
```

### Permissões no Docker
```bash
# Limpar volumes e containers
docker-compose down -v
docker system prune -f
```

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ pela equipe Orion** 


Panorama Geral da Solução
O objetivo é evoluir o protótipo funcional para uma aplicação mais robusta e profissional, aplicando as melhores práticas de desenvolvimento React. As principais melhorias propostas são:

Melhorar a Área de Login: Implementar validação de formulário em tempo real, feedback visual para o usuário e um tratamento de erros mais eficaz.

Refatorar o Componente Principal: Desmembrar o componente OrionApp em componentes menores e mais gerenciáveis, otimizando a manutenibilidade.

Centralizar a Lógica de Negócio: Utilizar Context API de forma mais eficiente e criar hooks personalizados para encapsular a lógica de cada funcionalidade.

Passo 1: Melhorando a Área de Login
A página de login em frontend/src/pages/Login.js e a lógica no frontend/src/contexts/AuthContext.js são um ótimo ponto de partida. Para aprimorá-las, vamos adicionar validação de formulário e feedback visual.

Objetivo: Proporcionar uma experiência de usuário mais fluida e interativa, evitando submissões de formulários com dados inválidos.

Código Sugerido para frontend/src/pages/Login.js
JavaScript

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, register, isAuthenticated } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (isRegisterMode && !formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório.';
    }
    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'O formato do e-mail é inválido.';
    }
    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha precisa ter no mínimo 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      if (isRegisterMode) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
    } finally {
      setLoading(false);
    }
  };

  // ... restante da estrutura do componente ...
  // No seu JSX, você pode exibir os erros da seguinte forma:
  // {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
};

export default Login;
Explicação das Melhorias
Validação em Tempo Real: A função validate verifica se os campos atendem aos critérios definidos (e.g., campo não vazio, formato de e-mail válido, comprimento mínimo da senha).

Feedback Visual: O estado errors guarda as mensagens de erro. Você pode usar este estado para exibir uma mensagem de erro abaixo de cada campo do formulário e aplicar um estilo (como uma borda vermelha) para indicar visualmente qual campo precisa de atenção.

Tratamento de Erros: A lógica no AuthContext.js já utiliza react-hot-toast para notificações, o que é uma excelente prática para dar feedback sobre o sucesso ou falha das requisições de login e registo.

Passo 2: Refatorando o Componente OrionApp
O ficheiro component.jsx concentra toda a lógica da aplicação, o que pode dificultar a manutenção. A melhor prática é dividi-lo em componentes menores e mais específicos.

Objetivo: Melhorar a organização, a reutilização e a legibilidade do código.

Estrutura de Pastas Sugerida para frontend/src/
frontend/
└── src/
    ├── components/
    │   ├── Layout.js
    │   ├── Sidebar.js
    │   ├── Header.js
    │   ├── UserDropdown.js
    │   └── common/
    │       ├── Modal.js
    │       └── Button.js
    ├── pages/
    │   ├── Dashboard.js
    │   ├── Login.js
    │   ├── Products/
    │   │   ├── ProductList.js
    │   │   └── ProductModal.js
    │   └── ... (outras páginas)
    ├── contexts/
    │   └── AuthContext.js
    ├── hooks/
    │   ├── useProducts.js
    │   └── useStock.js
    └── App.js
Exemplo de Refatoração
Sidebar.js e Header.js: Mova a lógica da barra lateral e do cabeçalho de component.jsx para estes novos ficheiros.

Layout.js: Crie um componente Layout que renderize o Sidebar, o Header e o conteúdo da página (children).

Páginas: Mantenha cada seção (Dashboard, Produtos, Estoque) como um componente de página separado, como já foi iniciado em frontend/src/pages/.

Componentes Reutilizáveis: Elementos como modais, botões e cartões devem ser extraídos para componentes genéricos em components/common/ para serem reutilizados em toda a aplicação.

Passo 3: Criando Hooks Personalizados
Para centralizar e reutilizar a lógica de negócio, a criação de hooks personalizados é uma abordagem moderna e eficiente em React.

Objetivo: Isolar a lógica de manipulação de estado e chamadas à API, deixando os componentes de UI mais limpos e focados apenas na apresentação.

Exemplo de useProducts.js
Este hook irá gerir o estado dos produtos.

JavaScript

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// Função para buscar produtos da API
const fetchProducts = async () => {
  const { data } = await axios.get('/api/products');
  return data.data.products;
};

// Hook personalizado para gerir produtos
export const useProducts = () => {
  const queryClient = useQueryClient();

  // Busca os dados da API usando React Query
  const { data: products, isLoading, isError } = useQuery('products', fetchProducts);

  // Mutação para adicionar um novo produto
  const addProductMutation = useMutation(
    (newProduct) => axios.post('/api/products', newProduct),
    {
      onSuccess: () => {
        // Invalida o cache para forçar uma nova busca
        queryClient.invalidateQueries('products');
        toast.success('Produto adicionado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erro ao adicionar produto.');
      },
    }
  );
  
  // Adicione aqui as mutações para editar e deletar produtos...

  return {
    products,
    isLoading,
    isError,
    addProduct: addProductMutation.mutate,
    // ...outras funções
  };
};
Como Usar no Componente de Produtos
JavaScript

import React from 'react';
import { useProducts } from '../hooks/useProducts';

const ProductList = () => {
  const { products, isLoading, addProduct } = useProducts();

  if (isLoading) {
    return <div>Carregando produtos...</div>;
  }

  const handleAddProduct = (newProductData) => {
    addProduct(newProductData);
  };

  return (
    <div>
      {/* Interface para listar os 'products' e um formulário/modal para chamar 'handleAddProduct' */}
    </div>
  );
};
Explicação das Melhorias
Separação de Responsabilidades: O hook useProducts fica responsável por toda a lógica de dados (buscar, adicionar, atualizar), enquanto o componente ProductList se concentra apenas em exibir a interface.

Gerenciamento de Estado com React Query: O react-query (já presente em frontend/package.json) simplifica o gerenciamento do estado do servidor, cuidando de cache, refetching e atualizações em segundo plano.

