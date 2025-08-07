#!/bin/bash

# Script de Deploy para Docker Desktop
echo "🐳 Iniciando deploy do Orion Gestor..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker Desktop primeiro."
    exit 1
fi

# Verificar se arquivo .env.prod existe
if [ ! -f .env.prod ]; then
    echo "⚠️  Arquivo .env.prod não encontrado."
    echo "📝 Copiando exemplo..."
    cp env.prod.example .env.prod
    echo "✅ Arquivo .env.prod criado. Configure suas variáveis de ambiente!"
    echo "🔧 Edite o arquivo .env.prod com suas configurações do Firebase"
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Remover imagens antigas (opcional)
read -p "🗑️  Remover imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Removendo imagens antigas..."
    docker-compose -f docker-compose.prod.yml down --rmi all
fi

# Build das imagens
echo "🔨 Fazendo build das imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose -f docker-compose.prod.yml up -d

# Aguardar serviços ficarem saudáveis
echo "⏳ Aguardando serviços ficarem saudáveis..."
sleep 30

# Verificar status
echo "📊 Verificando status dos serviços..."
docker-compose -f docker-compose.prod.yml ps

# Verificar logs
echo "📋 Últimos logs do backend:"
docker-compose -f docker-compose.prod.yml logs --tail=20 backend

echo "📋 Últimos logs do frontend:"
docker-compose -f docker-compose.prod.yml logs --tail=20 frontend

echo "✅ Deploy concluído!"
echo "🌐 Frontend: http://localhost:8000"
echo "🔧 Backend: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo "📚 API Docs: http://localhost:3001/api-docs"

# Verificar se tudo está funcionando
echo "🔍 Testando endpoints..."
curl -f http://localhost:3001/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend está funcionando!"
else
    echo "❌ Backend não está respondendo"
fi

curl -f http://localhost:8000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend está funcionando!"
else
    echo "❌ Frontend não está respondendo"
fi

echo "🎉 Orion Gestor está rodando em Docker Desktop!" 