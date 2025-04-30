#staage first
FROM node:18 AS builder  

WORKDIR /bapp 

COPY package*.json ./

RUN npm install 
#staage second
FROM node:18-alpine AS deployer

COPY . . 

WORKDIR /bapp 

COPY --from=builder /bapp ./

EXPOSE 5000 

CMD [ "node","index.js" ]