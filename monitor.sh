#!/bin/bash

# Script de Monitoramento Orion Gestor

echo "📊 STATUS DO ORION GESTOR - $(date)"
echo "================================================"

# Status dos containers
echo "🐳 CONTAINERS:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🏥 HEALTH CHECKS:"

# Verificar backend
if curl -f -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: FALHA"
fi

# Verificar frontend
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: FALHA"
fi

# Verificar Redis
if docker exec orion-redis-prod redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: FALHA"
fi

echo ""
echo "💾 USO DE RECURSOS:"

# Uso de CPU e Memória
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "📁 USO DE DISCO:"
df -h / | tail -1

echo ""
echo "🔗 PORTAS EM USO:"
netstat -tlnp | grep -E ':(80|443|3000|3001|6379)'