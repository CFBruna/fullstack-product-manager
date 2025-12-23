# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for TypeScript build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files and prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Generate Prisma Client in production
RUN npx prisma generate

EXPOSE 3001

# Start command
CMD ["node", "dist/server.js"]
