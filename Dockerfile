FROM node:16-alpine

RUN adduser -S centros
USER centros
RUN mkdir /home/centros/centros
WORKDIR /home/centros/centros
COPY --chown=centros:root . .
WORKDIR server

RUN npm ci
