# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy lock file i package.json
COPY pnpm-lock.yaml package.json ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage - serve static files
FROM node:22-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Caddy will proxy to this)
EXPOSE 3000

# Start the server
CMD ["serve", "-l", "3000", "-s", "dist"]
