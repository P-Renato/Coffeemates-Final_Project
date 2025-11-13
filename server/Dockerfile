
FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lock ./ 
COPY tsconfig.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 4343

# Start development server
CMD ["bun", "--watch", "index.ts"]