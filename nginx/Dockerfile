FROM public.ecr.aws/nginx/nginx:alpine
RUN apk add --no-cache certbot
RUN mkdir -p /var/lib/certbot
COPY scripts/setup.sh /setup.sh
RUN chmod +x /setup.sh
COPY config /etc/nginx/conf.d
ENTRYPOINT [ "../setup.sh" ]
