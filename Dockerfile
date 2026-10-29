# Estágio 1: Build dos assets otimizados com Tailwind CSS (Alpine Linux)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# Estágio 2: Servidor Web Nginx super leve baseado em Alpine Linux
FROM nginx:1.27-alpine

# Remove configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copia arquivos estáticos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Template do Nginx (processado automaticamente com envsubst pelo entrypoint oficial)
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Script que injeta variáveis de ambiente em env-config.js na inicialização do container
COPY docker/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

# Variáveis de ambiente padrão
ENV NGINX_PORT=80 \
    WHATSAPP_NUMBER="5522997711986" \
    STORE_NAME="TEKY BAZAR" \
    INSTAGRAM_URL="https://instagram.com/tekybazar" \
    STORE_ADDRESS="Estr. da Cruz - Flexeira (Pinheiros), São Pedro da Aldeia - RJ, 28946-195" \
    STORE_PHONE="(22) 99771-1986" \
    STORE_PHONE_TEL="+5522997711986" \
    STORE_HOURS="Seg a Sex: 08h às 18h | Sáb: 08h às 15h"

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${NGINX_PORT}/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
