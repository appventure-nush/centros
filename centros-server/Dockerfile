FROM node:16-alpine

RUN adduser -S centros
USER centros
RUN mkdir /home/centros/centros
WORKDIR /home/centros/centros
COPY --chown=centros:root . .
WORKDIR centros-server

RUN npm i
