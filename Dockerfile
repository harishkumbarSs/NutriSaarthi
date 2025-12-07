# ===========================================
# NutriSaarthi Full-Stack Dockerfile
# ===========================================
# Multi-stage build for optimized production images

# -------------------- STAGE 1: Build Client --------------------
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY client/ ./

# Build the React app
RUN npm run build

# -------------------- STAGE 2: Build Server --------------------
FROM node:20-alpine AS server-builder

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy source files
COPY server/ ./

# -------------------- STAGE 3: Production Image --------------------
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nutrisaarthi -u 1001

WORKDIR /app

# Copy server files
COPY --from=server-builder /app/server ./server
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Copy built client files
COPY --from=client-builder /app/client/dist ./client/dist

# Set ownership
RUN chown -R nutrisaarthi:nodejs /app

# Switch to non-root user
USER nutrisaarthi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the server
WORKDIR /app/server
CMD ["node", "src/index.js"]

