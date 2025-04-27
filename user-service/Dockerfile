# Use official Node.js 18 image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Command to run the application
CMD ["npm", "start"]