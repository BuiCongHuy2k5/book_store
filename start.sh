#!/bin/sh
# Copy keycloak.json vào đúng /app
if [ -f /etc/secrets/keycloak.json ]; then
  cp /etc/secrets/keycloak.json /app/keycloak.json
fi

# Chạy app
node dist/index.js
