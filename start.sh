#!/bin/sh

# Tạo keycloak.json từ biến môi trường Render
cat <<EOF > /app/keycloak.json
{
  "realm": "${KEYCLOAK_REALM}",
  "bearer-only": true,
  "auth-server-url": "${KEYCLOAK_SERVER_URL}",
  "json-enforcer-enabled": true,
  "client-id": "${KEYCLOAK_CLIENT_ID}",
  "secret": "${KEYCLOAK_CLIENT_SECRET}",
  "policy-enforcer": {
    "user-managed-access": {},
    "enforcement-mode": "ENFORCING",
    "paths": [
      {
        "name": "Merchant API",
        "path": "/api/merchant/:id",
        "methods": [
          { "method": "GET", "scopes": [] },
          { "method": "PATCH", "scopes": ["merchant#merchant:scopes:edit"] },
          { "method": "DELETE", "scopes": ["merchant#merchant:scopes:delete"] }
        ]
      },
      {
        "name": "Employee API",
        "path": "/api/employee/:id",
        "methods": [
          { "method": "GET", "scopes": ["employee#employee:scopes:view"] },
          { "method": "POST", "scopes": ["employee#employee:scopes:create"] },
          { "method": "PATCH", "scopes": ["employee#employee:scopes:edit"] },
          { "method": "DELETE", "scopes": ["employee#employee:scopes:delete"] }
        ]
      }
    ]
  }
}
EOF

# Chạy app
node dist/index.js
