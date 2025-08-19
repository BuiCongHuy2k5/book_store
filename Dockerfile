# Stage 1: Build
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy package files trước để cache cài dependencies
COPY package.json yarn.lock ./
RUN yarn install

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
RUN yarn install --production

# Expose port
EXPOSE 3001

# Run app
CMD ["yarn", "dev"]

-