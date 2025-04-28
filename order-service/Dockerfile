FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5003

ENV NODE_ENV=production
ENV PORT=5003

CMD ["npm", "start"] 