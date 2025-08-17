#https://pnpm.io/docker
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app

# Refetch only when pnpm-lock.yaml changes
COPY pnpm-lock.yaml .
RUN pnpm fetch

# Reinstall only when package.json changes
COPY package.json .
RUN pnpm install --offline

# Rebuild when anything changes
COPY . .
RUN pnpm build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=build /app/dist .

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]