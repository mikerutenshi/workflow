FROM node:lts-alpine@sha256:8f1827381eb7fca5a79ad21cb42e935546bedf67d9f668519a7db69d77d812bf as base
WORKDIR /usr/src/app/api
COPY package*.json ./

FROM base as production
ENV NODE_ENV production
RUN apk add dumb-init
RUN npm ci --only=production
COPY . .
CMD ["dumb-init", "npm", "start"]

FROM base as dev
ENV NODE_ENV development
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
RUN npm install
COPY . .
CMD /wait && npm start
