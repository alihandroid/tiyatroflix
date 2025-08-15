# Frontend Dockerfile for TiyatroFlix React App
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm run build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=builder /app/dist .

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]