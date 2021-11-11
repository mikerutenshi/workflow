#!/bin/sh
certbot certonly -n -d $DOMAINS \
    --webroot --webroot-path /var/www/certbot --email $EMAIL \
    --agree-tos --expand --debug --staging --dry-run


/usr/sbin/nginx -g "daemon off;"
