FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install `serve` globally to serve build folder
RUN npm install -g serve

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Expose port from environment or default to 3000
EXPOSE 3000

# Start the production server using 'serve'
CMD ["serve", "-s", "dist", "--listen", "0.0.0.0:${PORT}"]
