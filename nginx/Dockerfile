FROM nginx:stable-alpine@sha256:2012644549052fa07c43b0d19f320c871a25e105d0b23e33645e4f1bcf8fcd97
RUN apk add --no-cache certbot
RUN mkdir -p /var/www/certbot
COPY scripts/setup.sh /setup.sh
RUN chmod +x /setup.sh
COPY config/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["../setup.sh"]
