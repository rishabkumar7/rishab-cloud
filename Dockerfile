# syntax=docker/dockerfile:1.7

ARG HUGO_VERSION=0.147.0
ARG NGINX_VERSION=1.27-alpine

FROM hugomods/hugo:std-${HUGO_VERSION} AS builder
WORKDIR /src

COPY archetypes ./archetypes
COPY assets ./assets
COPY content ./content
COPY data ./data
COPY layouts ./layouts
COPY static ./static
COPY themes ./themes
COPY config.yml theme.toml ./

RUN hugo --minify

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runtime

COPY --from=builder /src/public /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:8080/ || exit 1
