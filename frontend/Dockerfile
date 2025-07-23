# --- Build Stage ---
FROM node:18-alpine AS build

# Accept a build-time argument from docker-compose.yml
ARG VITE_API_URL

# Set it as an environment variable for the 'npm run build' command
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The build command will now replace 'import.meta.env.VITE_API_URL' with the correct value
RUN npm run build

# --- Serve Stage ---
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]