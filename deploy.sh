#!/bin/bash

# Script de Deploy para VPS Hostinger
# Autor: Orion Team

set -e

echo "🚀 Iniciando deploy do Orion Gestor..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Iniciando..."
    systemctl start docker
fi

# Parar containers existentes
echo "⏹️ Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Limpar imagens antigas (opcional)
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Build e start dos containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem prontos..."
sleep 30

# Verificar status
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

# Verificar health checks
echo "🏥 Verificando saúde dos serviços..."
curl -f http://localhost:3001/health || echo "⚠️ Backend ainda não está respondendo"
curl -f http://localhost:3000 || echo "⚠️ Frontend ainda não está respondendo"

echo "✅ Deploy concluído!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:3001"
echo "📊 Status: docker-compose -f docker-compose.prod.yml ps"