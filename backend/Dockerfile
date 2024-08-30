FROM node:16-alpine

WORKDIR /Users/andreaspersson/Documents/DevOps_Jensen/DevOps_metodik2/gathering/gathering/backend

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 4000

CMD ["npm", "start"]