#!/bin/sh
certbot certonly -n -d $DOMAINS \
    --webroot --webroot-path /var/www/html/ --email $EMAIL \
    --agree-tos --expand --debug --staging


/usr/sbin/nginx -g "daemon off;"
