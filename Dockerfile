# Use an official Node.js runtime as the base image
FROM node:18-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your Node.js application is listening on
EXPOSE 3000

# Run the Node.js application
CMD [ "npm","start" ]
