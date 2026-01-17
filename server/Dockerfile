FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files first (for caching)
COPY server/package.json ./
COPY server/bun.lock* ./
COPY server/tsconfig.json ./

# Install all dependencies
RUN bun install --frozen-lockfile

# Copy ALL server source files
COPY server/ ./

FROM oven/bun:1-alpine
WORKDIR /app

# Copy production node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy ALL application files from builder
COPY --from=builder /app/index.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/models ./models
COPY --from=builder /app/middlewares ./middlewares
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/utils ./utils

# Create uploads directory structure
RUN mkdir -p uploads/posts uploads/profile uploads/cover

# Environment variables (Render will override these)
ENV NODE_ENV=production
ENV PORT=4343

# Expose port
EXPOSE 4343

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4343/api/test || exit 1

# Start command - uses package.json "start" script
CMD ["bun", "run", "start"]