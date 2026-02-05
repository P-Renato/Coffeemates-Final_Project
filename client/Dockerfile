FROM node:20-alpine

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

# Note: The built files in dist/ will be served by the backend Express server
# This Dockerfile is used by Render's build process, but the actual serving
# happens in the backend server/index.ts