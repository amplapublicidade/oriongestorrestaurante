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
