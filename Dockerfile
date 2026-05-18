# Stage 1: Build the Hugo site
FROM hugomods/hugo:std-0.147.0 AS builder

WORKDIR /src
COPY . .
RUN hugo --minify

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine

COPY --from=builder /src/public /usr/share/nginx/html

EXPOSE 80
