# 📦 Orion Gestor de Restaurante

Sistema completo de gestão para restaurantes com controle de estoque, fornecedores, produtos e relatórios.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express.js** - API RESTful
- **Firebase Firestore** - Banco de dados em nuvem
- **Firebase Admin SDK** - Autenticação e autorização
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Express Validator** - Validação de dados
- **Redis** - Cache de alta performance
- **Winston** - Sistema de logs estruturado
- **Jest** - Testes automatizados
- **Swagger** - Documentação da API

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
- **Conta no Firebase** - Para banco de dados em nuvem

### 🔥 Configuração do Firebase

1. **Crie um projeto no Firebase**
   - Acesse [console.firebase.google.com](https://console.firebase.google.com/)
   - Clique em "Adicionar projeto"
   - Siga o assistente de configuração

2. **Configure o Firestore Database**
   - No console do Firebase, vá para "Firestore Database"
   - Clique em "Criar banco de dados"
   - Escolha "Iniciar no modo de teste" (para desenvolvimento)

3. **Obtenha as credenciais de serviço**
   - Vá para "Configurações do Projeto" > "Contas de serviço"
   - Clique em "Gerar nova chave privada"
   - Baixe o arquivo JSON

4. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas credenciais do Firebase:
   ```env
   FIREBASE_PROJECT_ID=seu-projeto-id
   FIREBASE_PRIVATE_KEY_ID=sua-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=123456789012345678901
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40seu-projeto.iam.gserviceaccount.com
   FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com
   ```

### 🐳 Execução com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <repo-url>
cd orion-gestor-restaurante
```

2. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas credenciais do Firebase
```

3. **Execute com Docker Compose**
```bash
docker-compose up -d
```

4. **Acesse a aplicação**
- Frontend: http://localhost:8000
- Backend API: http://localhost:3001
- Documentação API: http://localhost:3001/api-docs
- Redis: localhost:6379

5. **Popular banco de dados (primeira execução)**
```bash
docker exec orion-backend npm run seed
```

### 💻 Desenvolvimento Local

#### Backend
```bash
cd backend
npm install
# Configure as variáveis de ambiente do Firebase
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
- **Firebase Firestore** - Banco de dados em nuvem

### 🚧 Em Desenvolvimento
- Interface completa de produtos
- Interface de fornecedores
- Relatórios e gráficos
- Sistema de pedidos
- Notificações em tempo real

## 🏗️ Arquitetura

```
orion-gestor-restaurante/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configurações (Firebase)
│   │   ├── models/         # Modelos de dados (Firestore)
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares (auth, validation)
│   │   └── server.js       # Servidor principal
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Custom hooks
│   │   ├── contexts/       # Context API
│   │   └── config/         # Configurações (Axios)
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Orquestração Docker
├── env.example            # Exemplo de variáveis de ambiente
└── README.md
```

## 🔧 Comandos Úteis

### Docker
```bash
# Iniciar aplicação
docker-compose up -d

# Parar aplicação
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir containers
docker-compose up -d --build

# Executar comando no container
docker exec orion-backend npm run seed
```

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Popular banco de dados
npm run seed
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado
- `PUT /api/auth/profile` - Atualizar perfil
- `POST /api/auth/change-password` - Alterar senha

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `PATCH /api/products/:id/stock` - Atualizar estoque

### Fornecedores
- `GET /api/suppliers` - Listar fornecedores
- `GET /api/suppliers/:id` - Buscar fornecedor
- `POST /api/suppliers` - Criar fornecedor
- `PUT /api/suppliers/:id` - Atualizar fornecedor
- `DELETE /api/suppliers/:id` - Deletar fornecedor

### Estoque
- `GET /api/inventory/movements` - Movimentos de estoque
- `GET /api/inventory/stock` - Status do estoque
- `POST /api/inventory/movement` - Registrar movimento
- `POST /api/inventory/adjust` - Ajuste de estoque

## 🔒 Segurança

- **JWT Tokens** para autenticação
- **bcryptjs** para hash de senhas
- **Helmet** para headers de segurança
- **Rate Limiting** para proteção contra ataques
- **CORS** configurado adequadamente
- **Validação de dados** com Express Validator

## 🚀 Melhorias Propostas

### Área de Login
- [x] Validação em tempo real
- [x] Design responsivo
- [x] Animações suaves
- [ ] Recuperação de senha
- [ ] Autenticação de dois fatores

### Refatoração do OrionApp
- [x] Componentes reutilizáveis
- [x] Custom hooks
- [x] Context API
- [ ] Lazy loading
- [ ] Code splitting

### Custom Hooks
- [x] useProducts
- [x] useSuppliers
- [ ] useOrders
- [ ] useInventory
- [ ] useAuth (melhorado)

### Funcionalidades Avançadas
- [ ] Sistema de notificações
- [ ] Relatórios em tempo real
- [ ] Integração com APIs externas
- [ ] Backup automático
- [ ] Monitoramento de performance

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para suporte@orion.com ou abra uma issue no GitHub.

