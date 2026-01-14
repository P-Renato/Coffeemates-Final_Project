# Use this for Render deployment
FROM oven/bun:1-alpine

WORKDIR /app

# Copy server files
COPY server/package.json ./
COPY server/bun.lockb ./
COPY server/tsconfig.json ./

# Install dependencies
RUN bun install --production

# Copy all server source code
COPY server/ ./

EXPOSE 4343

CMD ["bun", "run", "start"]