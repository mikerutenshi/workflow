FROM node:lts-alpine@sha256:8f1827381eb7fca5a79ad21cb42e935546bedf67d9f668519a7db69d77d812bf
#ENV NODE_ENV production
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
#RUN apk add dumb-init && chmod +x /wait
RUN chmod +x /wait
WORKDIR /usr/src/app/api
COPY package*.json ./
#RUN npm ci --only=production
RUN npm install
COPY . .
#CMD ["/wait", "&&", "dumb-init", "npm", "start"]
CMD /wait && npm start
