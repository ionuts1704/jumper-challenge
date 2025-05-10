FROM node:20

# Define build arguments with defaults
ARG APP_NAME
ARG APP_ENV
ARG APP_PORT
ARG APP_URL
ARG AUTH_SESSION_NAME
ARG AUTH_SESSION_SECRET
ARG AUTH_SESSION_RESAVE
ARG AUTH_SESSION_SAVE_UNINITIALIZED
ARG RPC_API_KEY

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install app dependencies
RUN npm i

# Copy ONLY the backend directory contents
COPY backend/ ./

# Build the TypeScript files
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the app
CMD npm run start