FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port 3000 (or 80 if you use a static server)
EXPOSE 3000

# Start the app (adjust if you use a static server like serve)
CMD ["npm", "start"]