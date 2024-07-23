FROM node:20-alpine

RUN apk add --no-cache dcron

WORKDIR /app

COPY . .

ENTRYPOINT ["sh", "entrypoint.sh"]