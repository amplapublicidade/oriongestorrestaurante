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