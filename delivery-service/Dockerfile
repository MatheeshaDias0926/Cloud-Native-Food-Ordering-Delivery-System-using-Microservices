FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

ENV NODE_ENV=production
ENV PORT=5004

CMD ["npm", "start"] 