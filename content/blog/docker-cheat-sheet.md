---
title: "Ultimate Docker Cheat Sheet"
date: "2023-05-30T14:45:23.533Z"
description: "Last year, I started learning more about containerization, which meant gaining some skills with Docker, an open-source project for automating the deployment of applications as portable, self-sufficient containers.If you use Docker, you are well aware..."
slug: "docker-cheat-sheet"
url: "/blog/docker-cheat-sheet/"
draft: false
tags:
  - "Docker"
  - "containers"
  - "Devops"
cover:
  image: "/images/blog/docker-cheat-sheet/eb36ac40-44eb-4bef-9476-180c4d5cba10-b36753c89c.png"
  alt: "Ultimate Docker Cheat Sheet"
hashnode:
  id: "64760c03e51153edb419d4ba"
  url: "https://blog.rishabkumar.com/docker-cheat-sheet"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Last year, I started learning more about containerization, which meant gaining some skills with Docker, an [open-source project](https://github.com/docker/docker) for automating the deployment of applications as portable, self-sufficient containers.  
If you use Docker, you are well aware of how effective it can be in streamlining and improving development procedures. However, the numerous commands and Dockerfile instructions can sometimes feel overwhelming, especially if you're new to the platform. That's why I've put together this Docker cheat sheet to help you keep track of the most common commands.

## **Docker Command Line Interface (CLI) Commands**

### General Commands

* `docker version`: Need to check which Docker version you're running? This command will provide all the information.
    
* `docker info`: If you're looking for system-wide information related to Docker, this command is your go-to.
    
* `docker help <command>`: Are you uncertain about a specific command? Add the command after `docker help` to get detailed information.
    

### Image Commands

* `docker images`: This command will provide a list of all the images present on your system.
    
* `docker pull <image>`: This command allows you to pull an image from a registry.
    
* `docker rmi <image>`: Use this command to remove one or images from your system.
    

### Container Commands

* `docker ps`: List all running containers with this command.
    
* `docker ps -a`: List all containers, including stopped ones.
    
* `docker run <image>`: Use this command to run a command in a new container, pulling the image if needed and starting the container.
    
* `docker stop <container>`: Stop a running container.
    
* `docker rm <container>`: To remove one or more containers from your system.
    

### Dockerfile Commands

* `docker build -t <tag> .`: This command lets you build an image from a Dockerfile in the current directory,
    
* `docker tag <image> <tag>`: You can tag an image to a name (local or registry) with this command.
    

### Docker Compose Commands

* `docker-compose up`: This command builds, (re)creates, starts, and attaches to containers for a service.
    
* `docker-compose down`: If you want to stop and remove containers, networks, images, and volumes, use this command.
    
* `docker-compose build`: This command is used to build or rebuild services.
    

## Dockerfile Instructions

Dockerfile instructions are used to assemble a Docker image. Here are some of the essentials:

* `FROM`: This sets the base image for subsequent instructions.
    
* `RUN`: This allows you to execute commands in a new layer on top of the current image and commit the results.
    
* `CMD`: This specifies the command to run when a container is launched.
    
* `EXPOSE`: You can inform Docker that the container listens on the specified network ports at runtime with this instruction.
    
* `ENV`: Set environment variables using this instruction.
    
* `ADD/COPY`: These instructions let you copy new files, directories, or remote file URLs and add them to the image filesystem.
    
* `ENTRYPOINT`: Configure a container that will run as an executable with this instruction.
    
* `VOLUME`: This creates a mount point and marks it as holding externally mounted volumes.
    
* `USER`: This sets the user name or UID used when running the image and for any following RUN, CMD, and ENTRYPOINT instructions.
    
* `WORKDIR`: This sets the working directory for any following RUN, CMD, ENTRYPOINT, COPY, and ADD instructions.
    

Lastly, it is always good practice to clean up and remove unused Docker resources. Docker provides a clean-up command for this: `docker system prune`. However, use this command with caution, as it will remove all unused resources.  
For more in-depth information about Docker CLI commands and Dockerfile instructions, refer to the [**official Docker documentation**](https://docs.docker.com/).

This cheat sheet should serve as a handy reference guide whether you're a Docker newbie or a seasoned professional. I also made a PDF version which you can [**download here.**](https://www.buymeacoffee.com/rishabincloud/e/139731)  
Free feel to reach out to me if you have any questions, I am [@rishabk7](https://twitter.com/rishabk7) on Twitter and you can also find me on [LinkedIn.](https://linkedin.com/in/rishabkumar7)
