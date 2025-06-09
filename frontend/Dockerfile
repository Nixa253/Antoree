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
EXPOSE ${PORT:-3000}

CMD serve -s build --listen tcp://0.0.0.0:${PORT:-3000}
