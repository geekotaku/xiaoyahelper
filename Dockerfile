FROM node:20-alpine

RUN apk add --no-cache tzdata dcron

WORKDIR /app

COPY . .

ENTRYPOINT ["sh", "entrypoint.sh"]