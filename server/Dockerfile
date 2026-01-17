FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files FIRST (for better caching)
COPY server/package.json ./
COPY server/bun.lock* ./
COPY server/tsconfig.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY server/src ./src

FROM oven/bun:1-alpine
WORKDIR /app

# Copy from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src

# Create uploads directory structure
RUN mkdir -p uploads/posts uploads/profile uploads/cover

# Environment variables will be passed from Render
ENV NODE_ENV=production
ENV PORT=4343

# Expose the port
EXPOSE 4343

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "import('node:http').then(http => http.get('http://localhost:4343/api/test', {timeout: 2000}, res => { if (res.statusCode === 200) process.exit(0); else process.exit(1) }).on('error', () => process.exit(1)))"

# Start the application
CMD ["bun", "run", "start"]