#!/bin/bash

# Script de Deploy para VPS Hostinger
# VPS: 212.85.2.16
# Projeto: Orion Gestor

set -e

echo "🚀 Iniciando deploy do Orion Gestor na VPS..."
echo "📍 Servidor: 212.85.2.16"
echo "📁 Diretório: $(pwd)"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    error "Execute este script do diretório raiz do projeto!"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    log "Iniciando Docker..."
    systemctl start docker
    sleep 5
fi

# Parar containers existentes
log "Parando containers existentes..."
docker-compose -f vps-docker-compose.yml down --remove-orphans 2>/dev/null || true

# Limpar recursos não utilizados
log "Limpando recursos Docker não utilizados..."
docker system prune -f

# Build das imagens
log "Construindo imagens Docker..."
docker-compose -f vps-docker-compose.yml build --no-cache

# Iniciar containers
log "Iniciando containers..."
docker-compose -f vps-docker-compose.yml up -d

# Aguardar containers ficarem prontos
log "Aguardando containers ficarem prontos..."
sleep 30

# Verificar status dos containers
log "Status dos containers:"
docker-compose -f vps-docker-compose.yml ps

# Verificar health checks
log "Verificando saúde dos serviços..."

# Aguardar um pouco mais para health checks
sleep 10

# Verificar backend
if curl -f -s http://localhost:3001/health > /dev/null; then
    log "✅ Backend: Funcionando"
else
    warning "⚠️ Backend ainda não está respondendo. Aguarde mais alguns segundos."
fi

# Verificar frontend
if curl -f -s http://localhost:3000 > /dev/null; then
    log "✅ Frontend: Funcionando"
else
    warning "⚠️ Frontend ainda não está respondendo. Aguarde mais alguns segundos."
fi

# Verificar Redis
if docker exec orion-redis-prod redis-cli ping > /dev/null 2>&1; then
    log "✅ Redis: Funcionando"
else
    warning "⚠️ Redis: Problema detectado"
fi

echo ""
echo "🎉 Deploy concluído!"
echo "📊 Acesso local:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   Health: http://localhost:3001/health"
echo ""
echo "🌐 Acesso externo:"
echo "   http://212.85.2.16 (após configurar Nginx)"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose -f vps-docker-compose.yml logs -f"
echo "   Status: docker-compose -f vps-docker-compose.yml ps"
echo "   Parar: docker-compose -f vps-docker-compose.yml down"