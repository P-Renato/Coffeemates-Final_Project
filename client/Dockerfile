FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Copy package files
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the production app
RUN npm run build

# Serve stage
FROM node:20-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app by serving the dist folder
CMD ["serve", "-s", "dist", "-l", "3000"]