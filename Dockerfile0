# syntax=docker/dockerfile:1

#FROM node:12.18.1
FROM node:lts-stretch-slim
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

ENV DATA_URL "https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true"

CMD [ "node", "server.js" ]
