# Stage 1: Build
FROM node:18 AS builder

WORKDIR /bapp

COPY package*.json ./
RUN npm install

COPY . .  

# Stage 2: Deploy
FROM node:18-alpine AS deployer

WORKDIR /bapp

COPY --from=builder /bapp ./

EXPOSE 5000

CMD ["node", "index.js"]
