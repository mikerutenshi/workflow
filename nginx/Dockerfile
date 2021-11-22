FROM public.ecr.aws/nginx/nginx:alpine as base

FROM base as production
RUN apk add --no-cache certbot
RUN mkdir -p /var/lib/certbot
COPY scripts/setup.sh /setup.sh
RUN chmod +x /setup.sh
COPY config /etc/nginx/conf.d
ENTRYPOINT [ "../setup.sh" ]

FROM base as dev
COPY config/custom-dev.conf /etc/nginx/conf.d/custom-dev.conf
