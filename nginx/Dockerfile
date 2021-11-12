FROM nginx:stable-alpine
RUN apk add --no-cache certbot
RUN mkdir -p /var/www/html
COPY scripts/setup.sh /setup.sh
RUN chmod +x /setup.sh
COPY config /etc/nginx/conf.d
ENTRYPOINT [ "../setup.sh" ]
