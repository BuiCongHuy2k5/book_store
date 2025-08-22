# Stage 1: Build
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy package files trước để cache cài dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Build TypeScript
RUN yarn build

# Stage 2: Run
FROM node:20-bookworm AS runtime

WORKDIR /app

# Copy từ stage builder
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

# Render sẽ inject PORT
EXPOSE 3000

# Chạy app (production)
# CMD ["node", "dist/index.js"]
# Entry point script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
