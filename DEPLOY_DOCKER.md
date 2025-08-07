# 🐳 Deploy com Docker Desktop

## 📋 Pré-requisitos

1. **Docker Desktop** instalado e rodando
2. **Git** para clonar o repositório
3. **Configurações do Firebase** prontas

## 🚀 Deploy Rápido

### 1. Clone o repositório
```bash
git clone https://github.com/amplapublicidade/oriongestorrestaurante.git
cd oriongestorrestaurante
```

### 2. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env.prod.example .env.prod

# Edite com suas configurações
nano .env.prod
```

### 3. Execute o deploy
```bash
./deploy.sh
```

## ⚙️ Configuração Manual

### 1. Configurar Firebase
Edite o arquivo `.env.prod` com suas configurações:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY_ID=seu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=seu-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx%40seu-projeto.iam.gserviceaccount.com
```

### 2. Build e Deploy
```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar serviços
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api-docs

## 📊 Comandos Úteis

### Ver logs
```bash
# Todos os serviços
docker-compose -f docker-compose.prod.yml logs

# Serviço específico
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Parar serviços
```bash
docker-compose -f docker-compose.prod.yml down
```

### Reiniciar serviços
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Ver status
```bash
docker-compose -f docker-compose.prod.yml ps
```

## 🔧 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar portas em uso
netstat -tulpn | grep :3001
netstat -tulpn | grep :8000

# Parar serviços que usam as portas
sudo lsof -ti:3001 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
```

### Problema: Erro de permissão
```bash
# Dar permissão ao script
chmod +x deploy.sh
```

### Problema: Firebase não conecta
1. Verifique as credenciais no `.env.prod`
2. Confirme se o arquivo JSON do Firebase está correto
3. Verifique se o projeto Firebase está ativo

### Problema: Containers não iniciam
```bash
# Ver logs detalhados
docker-compose -f docker-compose.prod.yml logs --tail=50

# Rebuild sem cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

## 📈 Monitoramento

### Health Checks
Os serviços têm health checks configurados:
- **Backend**: http://localhost:3001/health
- **Frontend**: http://localhost:8000
- **Redis**: ping interno

### Logs
Os logs são persistidos em:
- `./backend/logs/` - Logs do backend
- `docker-compose logs` - Logs dos containers

## 🔒 Segurança

### Variáveis Sensíveis
- Nunca commite o arquivo `.env.prod`
- Use chaves JWT seguras em produção
- Configure firewall adequadamente

### Firewall
```bash
# Permitir apenas portas necessárias
sudo ufw allow 8000  # Frontend
sudo ufw allow 3001  # Backend
sudo ufw enable
```

## 🚀 Produção

Para deploy em produção:

1. **Configure SSL/TLS** com certificados válidos
2. **Use um reverse proxy** (Nginx/Apache)
3. **Configure backup** do Redis
4. **Monitore recursos** (CPU, RAM, Disco)
5. **Configure logs** centralizados

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `docker-compose logs`
2. Teste os endpoints: `curl http://localhost:3001/health`
3. Verifique o status: `docker-compose ps`
4. Consulte a documentação da API: http://localhost:3001/api-docs 