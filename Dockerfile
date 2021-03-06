# syntax=docker/dockerfile:1

#FROM node:12.18.1
FROM node:lts-stretch-slim
ENV NODE_ENV=production

RUN apt update
RUN apt install -y git


WORKDIR /app

RUN git init
RUN git pull https://github.com/ortrud/compassTest


ENV DATA_URL "https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true"

CMD [ "node", "server.js" ]
