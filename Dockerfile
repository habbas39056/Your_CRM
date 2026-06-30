# Stage 1: Build the React frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/ClientApp
COPY ClientApp/package*.json ./
RUN npm ci --legacy-peer-deps
COPY ClientApp/ ./
RUN npm run build

# Stage 2: Production - Node.js backend serving built frontend
FROM node:20-slim
WORKDIR /app

# Copy backend package files and install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/ClientApp/dist ./ClientApp/dist

# Set port to 80 for Easypanel Traefik defaults
ENV PORT=80
EXPOSE 80
# Start the server
CMD ["node", "backend/server.js"]
