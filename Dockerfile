# Use official Node.js image as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app source code to the working directory
COPY . .

# Set environment variables for MongoDB Atlas connection
ENV MONGO_URI="mongodb+srv://nguuyenhoanglam:muxqUYHpiDYmu1l5@cluster-winku.qtl9hep.mongodb.net/?retryWrites=true&w=majority"

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]