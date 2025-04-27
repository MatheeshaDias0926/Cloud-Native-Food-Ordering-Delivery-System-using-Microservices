# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose the port (change according to service)
EXPOSE 3002

# Start the app
CMD ["npm", "start"]
