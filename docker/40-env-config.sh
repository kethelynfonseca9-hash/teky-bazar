#!/bin/sh
set -e

# Gera arquivo env-config.js em tempo de execução a partir das variáveis do container
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV_CONFIG = {
  WHATSAPP: "${WHATSAPP_NUMBER:-5522997711986}",
  NOME_LOJA: "${STORE_NAME:-TEKY BAZAR}",
  LINK_INSTAGRAM: "${INSTAGRAM_URL:-https://instagram.com/tekybazar}",
  ENDERECO: "${STORE_ADDRESS:-Estr. da Cruz - Flexeira (Pinheiros), São Pedro da Aldeia - RJ, 28946-195}",
  TELEFONE: "${STORE_PHONE:-(22) 99771-1986}",
  TELEFONE_LINK: "${STORE_PHONE_TEL:-+5522997711986}",
  HORARIO: "${STORE_HOURS:-Seg a Sex: 08h às 18h | Sáb: 08h às 15h}"
};
EOF
