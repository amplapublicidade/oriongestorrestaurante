#!/bin/bash

# Preparar deploy para Portainer
# Autor: Orion Team

set -e

echo "🐳 Preparando deploy para Portainer..."

# Criar estrutura de diretórios
mkdir -p portainer-deploy/nginx/conf.d

# Copiar arquivos necessários
echo "📋 Copiando arquivos..."

# Docker Compose
cp portainer-docker-compose.yml portainer-deploy/docker-compose.yml

# Nginx config
cp nginx-portainer.conf portainer-deploy/nginx/nginx.conf

# Criar configuração específica do site
cat > portainer-deploy/nginx/conf.d/default.conf << 'EOF'
# Esta configuração é carregada automaticamente pelo nginx.conf principal
# Configurações específicas do site podem ser adicionadas aqui
EOF

# Frontend e Backend
cp -r frontend portainer-deploy/
cp -r backend portainer-deploy/

# Firebase credentials
if [ -f "orion-gestor-firebase-adminsdk-fbsvc-ac432ef525.json" ]; then
    cp orion-gestor-firebase-adminsdk-fbsvc-ac432ef525.json portainer-deploy/
    echo "✅ Credenciais Firebase copiadas"
else
    echo "⚠️ Arquivo de credenciais Firebase não encontrado!"
    echo "   Certifique-se de copiar: orion-gestor-firebase-adminsdk-fbsvc-ac432ef525.json"
fi

# Criar arquivo .env para Portainer
cat > portainer-deploy/.env << 'EOF'
# Configurações de produção
NODE_ENV=production
REDIS_PASSWORD=orionredis2024
COMPOSE_PROJECT_NAME=orion-gestor

# Configurações do Firebase
GOOGLE_APPLICATION_CREDENTIALS=/app/orion-gestor-firebase-adminsdk-fbsvc-ac432ef525.json

# Configurações de rede
FRONTEND_PORT=3000
BACKEND_PORT=3001
PROXY_PORT=80
PROXY_PORT_SSL=443
EOF

# Criar README para o deploy
cat > portainer-deploy/README.md << 'EOF'
# Deploy Orion Gestor via Portainer

## Pré-requisitos
- Portainer instalado e funcionando
- Docker e Docker Compose disponíveis

## Passos para Deploy

### 1. Upload via Portainer
1. Acesse Portainer: http://212.85.2.16:9000
2. Vá em "Stacks" → "Add stack"
3. Nome: `orion-gestor`
4. Método: "Upload"
5. Faça upload do arquivo `docker-compose.yml`
6. Configure as variáveis de ambiente (arquivo .env)
7. Clique em "Deploy the stack"

### 2. Verificar Deploy
- Frontend: http://212.85.2.16:3000
- Backend: http://212.85.2.16:3001/health
- Aplicação: http://212.85.2.16

### 3. Monitorar
- Use a interface do Portainer para ver logs
- Monitore status dos containers
- Verifique health checks

## Troubleshooting
- Logs: Via interface Portainer
- Restart: Via interface Portainer
- Update: Fazer novo upload do compose file
EOF

# Criar arquivo ZIP para upload
echo "📦 Criando arquivo ZIP..."
cd portainer-deploy
zip -r ../orion-gestor-portainer.zip .
cd ..

echo ""
echo "✅ Preparação concluída!"
echo ""
echo "📦 Arquivo criado: orion-gestor-portainer.zip"
echo ""
echo "🚀 Próximos passos:"
echo "1. Transferir o ZIP para a VPS:"
echo "   scp orion-gestor-portainer.zip root@212.85.2.16:/tmp/"
echo ""
echo "2. Na VPS, extrair e usar via Portainer:"
echo "   cd /tmp && unzip orion-gestor-portainer.zip"
echo ""
echo "3. Ou fazer upload direto via interface Portainer"
echo ""
echo "🌐 Acesse Portainer em: http://212.85.2.16:9000"