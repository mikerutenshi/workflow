#!/bin/sh
certbot certonly -n -d $DOMAINS \
    --standalone --preferred-challenges http --email $EMAIL \
    --agree-tos --expand --debug


/usr/sbin/nginx -g "daemon off;"
