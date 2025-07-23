FROM node:18-alpine

# ADD THIS LINE: Install curl so the healthcheck command can work
RUN apk add --no-cache curl

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]