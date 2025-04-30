#staage first
FROM node:18 AS builder  

WORKDIR /app 

COPY package*.json ./

RUN npm install 
#staage second
FROM node:18-alpine AS deployer

COPY . . 

WORKDIR /app 

COPY --from=builder /app ./

EXPOSE 5000 

CMD [ "node","index.js" ]