# Use official Node.js runtime as base image
FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy server directory
COPY server ./server

# Copy client directory
COPY client ./client

# Install dependencies
RUN npm install && \
    cd server && npm install && \
    cd ../client && npm install --legacy-peer-deps && \
    cd ..

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Expose ports
EXPOSE 3001 5173

# Set environment
ENV NODE_ENV=production

# Switch to non-root user
USER nodejs

# Start both client and server
CMD ["npm", "run", "dev"]
