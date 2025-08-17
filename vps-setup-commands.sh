#!/bin/bash

# Comandos para executar na VPS
# Execute estes comandos um por vez na sua VPS

echo "🚀 GUIA DE SETUP DA VPS - Orion Gestor"
echo "========================================"
echo ""

echo "1️⃣ CONECTAR NA VPS:"
echo "ssh root@212.85.2.16"
echo ""

echo "2️⃣ ATUALIZAR SISTEMA:"
echo "apt update && apt upgrade -y"
echo ""

echo "3️⃣ INSTALAR DOCKER:"
echo "curl -fsSL https://get.docker.com -o get-docker.sh"
echo "sh get-docker.sh"
echo "apt install docker-compose -y"
echo ""

echo "4️⃣ INSTALAR OUTRAS DEPENDÊNCIAS:"
echo "apt install git nginx certbot python3-certbot-nginx curl wget htop nano -y"
echo ""

echo "5️⃣ CRIAR DIRETÓRIO E TRANSFERIR PROJETO:"
echo "mkdir -p /var/www/oriongestor"
echo "cd /var/www/oriongestor"
echo ""
echo "# Se tem no GitHub:"
echo "git clone https://github.com/seu-usuario/oriongestor.git ."
echo ""
echo "# OU transferir via SCP do seu computador:"
echo "# scp -r /caminho/local/* root@212.85.2.16:/var/www/oriongestor/"
echo ""

echo "6️⃣ COPIAR ARQUIVOS DE CONFIGURAÇÃO:"
echo "# Você precisa transferir estes arquivos para a VPS:"
echo "# - vps-docker-compose.yml"
echo "# - vps-nginx.conf"
echo "# - vps-deploy.sh"
echo ""

echo "7️⃣ EXECUTAR DEPLOY:"
echo "chmod +x vps-deploy.sh"
echo "./vps-deploy.sh"
echo ""

echo "8️⃣ CONFIGURAR NGINX:"
echo "cp vps-nginx.conf /etc/nginx/sites-available/oriongestor"
echo "ln -s /etc/nginx/sites-available/oriongestor /etc/nginx/sites-enabled/"
echo "rm -f /etc/nginx/sites-enabled/default"
echo "nginx -t"
echo "systemctl restart nginx"
echo ""

echo "9️⃣ CONFIGURAR FIREWALL:"
echo "ufw allow ssh"
echo "ufw allow 80"
echo "ufw allow 443"
echo "ufw --force enable"
echo ""

echo "🔟 TESTAR ACESSO:"
echo "curl http://localhost:3001/health"
echo "curl http://212.85.2.16"
echo ""

echo "✅ FINALIZADO!"
echo "Acesse: http://212.85.2.16"