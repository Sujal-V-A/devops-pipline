# Production Dockerfile for Node.js Express service
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN rm -f package-lock.json
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/server.cjs"]
