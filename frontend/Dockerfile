FROM node:16-alpine

WORKDIR /Users/andreaspersson/Documents/DevOps_Jensen/DevOps_metodik2/gathering/gathering/frontend

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]