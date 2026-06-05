---
title: "Pokedex with Next.js and serving it with Docker"
date: "2021-01-28T11:59:33.094Z"
lastmod: "2021-01-28T12:28:27.659Z"
description: "Hello amazing people 👋\nI recently found an amazing article about creating a Pokedex with Next.js, thanks to daily.dev\nHence, I tried it myself and was amazed by some features of NextJS. Here is the article.\nBut for deploying it I wanted to try and u..."
slug: "pokedex-with-nextjs-and-serving-it-with-docker"
url: "/blog/pokedex-with-nextjs-and-serving-it-with-docker/"
draft: false
tags:
  - "Docker"
  - "Next.js"
  - "Web Development"
  - "2Articles1Week"
  - "dailydev"
cover:
  image: "/images/blog/pokedex-with-nextjs-and-serving-it-with-docker/WFXpTYOYX-1e4291cdc3.png"
  alt: "Pokedex with Next.js and serving it with Docker"
hashnode:
  id: "6012a725ea8244735e7a6dc0"
  url: "https://blog.rishabkumar.com/pokedex-with-nextjs-and-serving-it-with-docker"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello amazing people 👋

I recently found an amazing article about creating a Pokedex with Next.js, thanks to [daily.dev](https://daily.dev/)

Hence, I tried it myself and was amazed by some features of NextJS. Here is the [article](https://soshace.com/building-a-pokedex-with-next-js/).
But for deploying it I wanted to try and use docker.
So in this article, we will build a docker image with Nginx and serve our Next app using that.

## Demo:

Here is the Pokedex repo that you can clone and run as docker container:
```
// clone the project
git clone https://github.com/rishabkumar7/next-pokedex.git

// install dependencies and start
npm install

// build the Docker image
docker build -t nextpokedex .

// run the app
docker run -d --name nextpokedex -p 80:80 nextpokedex
```

### What is Nginx?
NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more. NGINX processes are divided into one master process and several worker processes. The master process takes care of evaluating configuration and maintaining worker processes and the worker processes take care of actual requests. We can define the number of worker processes in the configuration file which can be placed in the directory `/usr/local/etc/nginx`, `/etc/nginx` or `/usr/local/nginx/conf`.
The configuration file consists of directives that form the modules or contexts. There are two kinds of directives: simple directives and block directives. A simple directive has names and parameters separated by a space and ends with a semicolon like this listen 80; . A block directive is the same but has additional information and surrounded by braces like this `{ listen 80; root /usr/share/nginx/html; }`.

```
worker_processes 4;

events { worker_connections 1024; }

http {
    server {
        listen 80;
        root  /usr/share/nginx/html;
        include /etc/nginx/mime.types;

        location /appui {
            try_files $uri /index.html;
        }
    }
}
```

### Implementing Docker:

We are using multi-stage builds to build the Docker image. Here is the Dockerfile for the project.

```
# step 1 as builder
FROM node:10-alpine as builder

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install && mkdir /next-pokedex && mv ./node_modules ./next-pokedex

WORKDIR /next-pokedex

COPY . .

# Build the project and copy the files
RUN npm run build


FROM nginx:alpine

#!/bin/sh

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /next-pokedex/out /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

#### Step 1
We are using node:10-alpine as a base image for the stage1 and copying package.json to install all the dependencies. We then copy the remaining project later, in that way we can skip the installing dependencies every time there is a change in the files. Docker uses a cache to build the image from existing layers if there is no change.
We build the project with the Vue CLI and all the built static files are placed in the /out folder.

```
"scripts": {
   "dev": "next dev",
   "build": "next build && next export",
   "start": "next start"
}
```

#### Step 2
- Step 2 starts with the base image `nginx:alpine` and copy the `nginx.conf` file, remove the index file from the root location, and finally, copy all the files from step 1 to the root location where it can serve the content from.
- Build the Image and Run the Project:

Let’s build the project with this command
 
`docker build -t nextpokedex .` 

And you can run the project with this command 

`docker run -d --name nextpokedex -p 80:80 nextpokedex .` 

You can run the app on http://localhost:80.

![image.png](/images/blog/pokedex-with-nextjs-and-serving-it-with-docker/CE5Dl7_sD-663ffabe7a.png)

VOILA!!
![Voila](/images/blog/pokedex-with-nextjs-and-serving-it-with-docker/giphy-940c4b7df3.gif)

Please feel free to reach out if you have any concerns or run into any issues.
Also, if you haven't checked out daily.dev and are willing to join, it would help me win a shirt if you use my [referral link](https://api.daily.dev/get?r=rishabkumar7).
