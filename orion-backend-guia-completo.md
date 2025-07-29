# Sistema Orion - Backend Development Guide

## 📋 Visão Geral do Projeto

O **Orion Gestor de Compras** é um sistema completo de gestão para restaurantes que inclui controle de estoque, gerenciamento de fornecedores, pedidos, vendas e financeiro. Este guia fornece todas as especificações necessárias para desenvolver o backend da aplicação.

## 🏗 Arquitetura Recomendada

### Stack Tecnológica

* **Backend**: Node.js + Express.js
* **Banco de Dados**: PostgreSQL
* **ORM**: Prisma
* **Autenticação**: JWT + bcrypt
* **Validação**: Joi ou Zod
* **Upload de Arquivos**: Multer + AWS S3/CloudStorage
* **WebSocket**: Socket.io (para notificações em tempo real)
* **Documentação**: Swagger/OpenAPI
* **Testes**: Jest + Supertest

### Estrutura de Pastas Sugerida

```
orion-backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── config/
│   └── validators/
├── prisma/
├── tests/
├── docs/
└── uploads/
```

## 📊 Modelo de Dados (Schema do Banco)

### Tabela: users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- admin, manager, user
  avatar VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: empresas

```sql
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: filiais

```sql
CREATE TABLE filiais (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  gerente VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ativa', -- ativa, inativa
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: fornecedores

```sql
CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  contato VARCHAR(255),
  telefone VARCHAR(20),
  email VARCHAR(255),
  categoria VARCHAR(100),
  especialidade TEXT,
  endereco TEXT,
  cnpj VARCHAR(18),
  rating DECIMAL(2,1) DEFAULT 0.0,
  status VARCHAR(20) DEFAULT 'ativo', -- ativo, inativo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: produtos

```sql
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  unidade VARCHAR(10) NOT NULL, -- kg, L, un, pct
  fornecedor_id INTEGER REFERENCES fornecedores(id),
  preco DECIMAL(10,2),
  estoque_ideal INTEGER DEFAULT 0,
  categoria VARCHAR(100),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: estoque

```sql
CREATE TABLE estoque (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER REFERENCES produtos(id),
  filial_id INTEGER REFERENCES filiais(id),
  quantidade INTEGER NOT NULL DEFAULT 0,
  data_atualizacao DATE NOT NULL,
  usuario_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(produto_id, filial_id, data_atualizacao)
);
```

### Tabela: pedidos

```sql
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES users(id),
  filial_id INTEGER REFERENCES filiais(id),
  data_pedido DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, enviado, recebido, cancelado
  observacoes TEXT,
  valor_total DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: pedido\_items

```sql
CREATE TABLE pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: vendas

```sql
CREATE TABLE vendas (
  id SERIAL PRIMARY KEY,
  filial_id INTEGER REFERENCES filiais(id),
  usuario_id INTEGER REFERENCES users(id),
  cliente VARCHAR(255),
  data_venda DATE NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'finalizada', -- pendente, finalizada, cancelada
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: venda\_items

```sql
CREATE TABLE venda_items (
  id SERIAL PRIMARY KEY,
  venda_id INTEGER REFERENCES vendas(id) ON DELETE CASCADE,
  produto_nome VARCHAR(255) NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: transacoes\_financeiras

```sql
CREATE TABLE transacoes_financeiras (
  id SERIAL PRIMARY KEY,
  filial_id INTEGER REFERENCES filiais(id),
  usuario_id INTEGER REFERENCES users(id),
  descricao VARCHAR(255) NOT NULL,
  tipo VARCHAR(10) NOT NULL, -- entrada, saida
  categoria VARCHAR(100),
  valor DECIMAL(10,2) NOT NULL,
  data_transacao DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmada', -- pendente, confirmada, cancelada
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: contas\_pagar

```sql
CREATE TABLE contas_pagar (
  id SERIAL PRIMARY KEY,
  filial_id INTEGER REFERENCES filiais(id),
  descricao VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, pago, vencido
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: colaboradores

```sql
CREATE TABLE colaboradores (
  id SERIAL PRIMARY KEY,
  filial_id INTEGER REFERENCES filiais(id),
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  email VARCHAR(255),
  telefone VARCHAR(20),
  salario DECIMAL(10,2),
  data_admissao DATE,
  status VARCHAR(20) DEFAULT 'ativo', -- ativo, inativo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: clientes

```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  filial_id INTEGER REFERENCES filiais(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  categoria VARCHAR(50) DEFAULT 'Regular', -- VIP, Premium, Regular
  data_cadastro DATE DEFAULT CURRENT_DATE,
  ultima_visita DATE,
  total_gasto DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: configuracoes

```sql
CREATE TABLE configuracoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES users(id),
  filial_id INTEGER REFERENCES filiais(id),
  chave VARCHAR(255) NOT NULL,
  valor JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, filial_id, chave)
);
```

### Tabela: backups

```sql
CREATE TABLE backups (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES users(id),
  tipo VARCHAR(50) NOT NULL, -- manual, automatico
  tamanho VARCHAR(20),
  arquivo VARCHAR(255),
  status VARCHAR(20) DEFAULT 'sucesso', -- sucesso, erro
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: logs\_sistema

```sql
CREATE TABLE logs_sistema (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES users(id),
  acao VARCHAR(255) NOT NULL,
  detalhes JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠 Principais Endpoints da API

### Autenticação

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Usuários

```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Empresas e Filiais

```
GET    /api/empresas
POST   /api/empresas
PUT    /api/empresas/:id
GET    /api/filiais
POST   /api/filiais
PUT    /api/filiais/:id
DELETE /api/filiais/:id
```

### Fornecedores

```
GET    /api/fornecedores
GET    /api/fornecedores/:id
POST   /api/fornecedores
PUT    /api/fornecedores/:id
DELETE /api/fornecedores/:id
GET    /api/fornecedores/categorias
```

### Produtos

```
GET    /api/produtos
GET    /api/produtos/:id
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id
POST   /api/produtos/import-excel
GET    /api/produtos/export-excel
```

### Estoque

```
GET    /api/estoque
GET    /api/estoque/:filialId/:data
POST   /api/estoque/atualizar
GET    /api/estoque/alertas
GET    /api/estoque/relatorio
```

### Pedidos

```
GET    /api/pedidos
GET    /api/pedidos/:id
POST   /api/pedidos
PUT    /api/pedidos/:id
DELETE /api/pedidos/:id
POST   /api/pedidos/:id/enviar-whatsapp
GET    /api/pedidos/sugestoes/:filialId/:data
```

### Vendas

```
GET    /api/vendas
GET    /api/vendas/:id
POST   /api/vendas
PUT    /api/vendas/:id
DELETE /api/vendas/:id
GET    /api/vendas/relatorios/dashboard
GET    /api/vendas/relatorios/mensal
```

### Financeiro

```
GET    /api/financeiro/transacoes
POST   /api/financeiro/transacoes
PUT    /api/financeiro/transacoes/:id
DELETE /api/financeiro/transacoes/:id
GET    /api/financeiro/contas-pagar
POST   /api/financeiro/contas-pagar
PUT    /api/financeiro/contas-pagar/:id/pagar
GET    /api/financeiro/fluxo-caixa
GET    /api/financeiro/dashboard
```

### Colaboradores

```
GET    /api/colaboradores
POST   /api/colaboradores
PUT    /api/colaboradores/:id
DELETE /api/colaboradores/:id
GET    /api/colaboradores/folha-pagamento
```

### Clientes

```
GET    /api/clientes
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id
GET    /api/clientes/relatorios
```

### Dashboard e Relatórios

```
GET    /api/dashboard/metricas
GET    /api/dashboard/graficos
GET    /api/relatorios/vendas-semanais
GET    /api/relatorios/produtos-mais-vendidos
GET    /api/relatorios/fornecedores-top
```

### Configurações e Utilitários

```
GET    /api/configuracoes
PUT    /api/configuracoes
POST   /api/backup/criar
GET    /api/backup/historico
POST   /api/backup/restaurar/:id
GET    /api/logs
```

## 🔐 Sistema de Autenticação

### Middleware de Autenticação

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### Middleware de Autorização por Role

```javascript
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};
```

## 📱 Funcionalidades Especiais

### 1. Integração WhatsApp

* Endpoint para envio de pedidos via WhatsApp Web
* Formatação automática de mensagens
* Log de envios

### 2. Sistema de Notificações

* WebSocket para notificações em tempo real
* Alertas de estoque baixo
* Notificações de vencimento de contas

### 3. Upload de Arquivos

* Upload de fotos de produtos
* Import/Export Excel
* Backup de dados

### 4. Relatórios e Analytics

* Gráficos de vendas
* Análise de fornecedores
* Métricas de estoque
* Fluxo de caixa

## 🗃 Exemplo de Estrutura Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  avatar    String?
  phone     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Empresa {
  id        Int      @id @default(autoincrement())
  nome      String
  cnpj      String?  @unique
  endereco  String?
  telefone  String?
  email     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  filiais   Filial[]

  @@map("empresas")
}

// ... outros models
```

## ⚙️ Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/orion_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# AWS S3 (para uploads)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="orion-uploads"
AWS_REGION="us-east-1"

# WhatsApp API (opcional)
WHATSAPP_API_URL="https://api.whatsapp.com"
WHATSAPP_TOKEN="your-whatsapp-token"

# Email (para notificações)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-email-password"
```

## 🚀 Scripts de Inicialização

### package.json

```json
{
  "name": "orion-backend",
  "version": "1.0.0",
  "description": "Backend para o Sistema Orion de Gestão de Compras",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node prisma/seed.js",
    "db:reset": "prisma migrate reset",
    "build": "tsc",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.9.2",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "socket.io": "^4.7.2",
    "xlsx": "^0.18.5",
    "nodemailer": "^6.9.4",
    "aws-sdk": "^2.1424.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "@types/node": "^20.4.5",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

## 📊 Seeds (Dados Iniciais)

### prisma/seed.js

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Criar empresa padrão
  const empresa = await prisma.empresa.create({
    data: {
      nome: 'Orion Restaurante',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua das Flores, 123',
      telefone: '(11) 99999-9999',
      email: 'contato@orion.com'
    }
  });

  // Criar filial padrão
  const filial = await prisma.filial.create({
    data: {
      empresaId: empresa.id,
      nome: 'Filial Centro',
      endereco: 'R. das Palmeiras, 123',
      telefone: '(11) 3333-4444',
      gerente: 'Carlos Silva',
      status: 'ativa'
    }
  });

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: {
      name: 'Anderson',
      email: 'admin@orion.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  // Criar fornecedores
  const fornecedores = [
    {
      nome: 'Hortifruti Silva',
      contato: 'Sr. Silva',
      telefone: '(11) 3333-1111',
      email: 'silva@hortifruti.com',
      categoria: 'Frutas e Verduras',
      especialidade: 'Frutas e Verduras',
      rating: 4.8
    },
    {
      nome: 'Distribuidora Grãos',
      contato: 'Ana Costa',
      telefone: '(11) 4444-2222',
      email: 'ana@graos.com',
      categoria: 'Grãos e Cereais',
      especialidade: 'Grãos e Cereais',
      rating: 4.5
    },
    {
      nome: 'Açougue Central',
      contato: 'João Carnes',
      telefone: '(11) 5555-3333',
      email: 'joao@acougue.com',
      categoria: 'Carnes',
      especialidade: 'Carnes',
      rating: 4.7
    }
  ];

  for (const fornecedor of fornecedores) {
    await prisma.fornecedor.create({ data: fornecedor });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 🧪 Exemplo de Teste

### tests/auth.test.js

```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Authentication', () => {
  test('POST /api/auth/login - should login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@orion.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('POST /api/auth/login - should fail with wrong credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@orion.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });
});
```

## 📝 Documentação da API

Use Swagger para documentar automaticamente a API:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orion API',
      version: '1.0.0',
      description: 'API do Sistema Orion de Gestão de Compras',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

## 🔧 Comandos de Inicialização

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configurar banco de dados:**

   ```bash
   npx prisma migrate dev
   ```

3. **Popular com dados iniciais:**

   ```bash
   npm run db:seed
   ```

4. **Iniciar em desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Executar testes:**

   ```bash
   npm test
   ```

## 📚 Próximos Passos

1. Implementar todos os endpoints listados
2. Adicionar validação de dados com Joi/Zod
3. Implementar sistema de logs
4. Configurar monitoramento (PM2, New Relic)
5. Implementar cache com Redis
6. Adicionar rate limiting
7. Configurar CI/CD
8. Implementar backup automático
9. Adicionar documentação completa
10. Implementar testes de integração

***

Este guia fornece uma base sólida para o desenvolvimento do backend do Sistema Orion. Todas as funcionalidades do frontend foram mapeadas e estruturadas para facilitar a implementação.
