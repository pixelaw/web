# Use the official Node.js 20 image.
FROM node:20

# Set the working directory.
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies.
RUN yarn install

# Copy local code to the container image.
COPY . .

# Build the application
RUN yarn build

# Use a lightweight Node.js image for the runtime.
FROM node:20-alpine

WORKDIR /app

# Copy build artifacts from the builder stage.
COPY --from=0 /app/dist ./

# Start the application
CMD ["yarn", "serve"]
