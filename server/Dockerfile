
FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY server/package.json ./
COPY server/bun.lock* ./ 
COPY server/tsconfig.json ./

COPY server/src ./src

# Install dependencies
RUN bun install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 4343

# Start development server
CMD ["bun", "run", "start"]