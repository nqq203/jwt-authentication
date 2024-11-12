# Stage 1: Build the React application
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to work directory
COPY package*.json ./

# Install dependencies
RUN npm install --silent || yarn install --silent

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the application
RUN npm run build || yarn build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration file (if you have one)
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]