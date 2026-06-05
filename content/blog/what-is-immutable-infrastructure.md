---
title: "What is Immutable Infrastructure?🤔"
date: "2020-08-02T20:44:34.674Z"
lastmod: "2020-08-02T21:09:17.968Z"
description: "As Cloud is getting more popular, so is the immutable infrastructure and historically we have been using the mutable infrastructure.\nBut hey, what is Mutable or Immutable?\nAccording to Cambridge Dictionary:\n\nMutable: able or likely to change\nImmutabl..."
slug: "what-is-immutable-infrastructure"
url: "/blog/what-is-immutable-infrastructure/"
draft: false
tags:
  - "Cloud"
  - "Cloud Computing"
  - "Devops"
cover:
  image: "/images/blog/what-is-immutable-infrastructure/QylCxcsAv-f9b9d42521.png"
  alt: "What is Immutable Infrastructure?🤔"
hashnode:
  id: "5f272712bcc1a77423c4013d"
  url: "https://blog.rishabkumar.com/what-is-immutable-infrastructure"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

**As Cloud is getting more popular, so is the immutable infrastructure and historically we have been using the mutable infrastructure.**

But hey, what is Mutable or Immutable?
According to Cambridge Dictionary:
- Mutable: able or likely to change
- Immutable: not changing, or unable to be changed

## What is Mutable Infrastructure? 
Now, in terms of Infrastructure, Mutable implies that the infrastructure will be persistently refreshed, changed, and tuned to meet the progressing needs of the reason it serves. 
Mutable Infrastructure stretches out to each server and switch that is extraordinary. The IT staff knows every server, its characteristics, and frequently has spent incalculable hours finding where the issue originated from just to determine it since that is quicker and far less terrifying than reconstructing the framework being referred to.
This model is the thing that the Information Technology and Services industry has been founded on, and it has directed how it runs.

### Example of Mutable in Real World
To better understand the idea of common mutable infrastructure in the IT industry, this is a common use case that shows a server evolving through continually being updated in-place.

#### Step 1 – Deploy a new Ubuntu server on DigitalOcean or any VPS
For Digital Ocean:
```bash
$ curl -X POST "https://api.digitalocean.com/v2/droplets" \ 
$ -d'{"name":"My-Droplet","region":"nyc2","size":"512mb","image":"ubuntu-16-04-x64"}' \ 
$ -H "Authorization: Bearer $TOKEN" \ 
$ -H "Content-Type: application/json"
```

#### Step 2 – Connect to the server
Connect to the server, and apply the latest updates, and install and configure Apache with PHP
```bash
$ ssh root@my-ubuntu 
$ apt-get update 
$ apt-get upgrade 
$ apt-get install apache2 
$ apt-get install php5 libapache2-mod-php5 php5-mcrypt
```

#### Step 3 – Render the graphics
A few days later developers require a new PHP library for rendering graphics.
```bash
$ ssh root@my-ubuntu 
$ apt-get update 
$ apt-get install php5-gd
```

#### Step 4 – Patch the server
Patching the server monthly, for security and support reasons.
```bash
$ ssh root@my-ubuntu 
$ apt-get update 
$ apt-get upgrade
```

This kind of cycle will continue until there is a reason to rebuild the server.
-------------------------------------------

## Now, the Immutable Infrastructure
Since we have a thought of what mutable Infrastructure is, and we know the meaning of immutable, how about we go over what the idea of immutable infrastructure brings to the table. 
- The idea of immutable infrastructure:
The idea for immutable infrastructure is to manufacture the infrastructure parts to a careful arrangement of particulars. No deviation, no changes. What will be will be? In the event that a change to detail is required, at that point, an entirely different arrangement of infrastructure is provisioned dependent on the refreshed necessities, and the past infrastructure is removed from administration as it is out of date. 
This idea is like what's going on in different businesses like customer hardware. It is currently extremely regular for cell phones to have batteries that can't be supplanted or capacity that can't be overhauled. So as opposed to redesigning gadgets in the field, those gadgets are presently immutable and the entire gadget should be supplanted. This gives a degree of consistency that makes bolster simpler. Notwithstanding the quantity of gadgets in administration, you know precisely what the determinations of every gadget are and can without much of a stretch supplant as-is in case of an issue. 

- Immutable infrastructure in IT:
The essential technology that makes immutable infrastructure conceivable at any scale is virtualization (both programming and equipment) across systems administration, servers, and capacity. Virtualization is at the center of the cutting edge server farm, and makes distributed computing conceivable. Provisioning and resigning physical equipment to suit for each change is cost and time restrictive. That is the reason mutable Infrastructure has been the standard in everything except the greatest organizations, until as of late when virtualization got ordinary. Containers (ex: Docker) are the most up to date pattern in the immutable infrastructure space, and they are just another layer of virtualization.

- Infrastructure as Code is the perfect method to make immutable infrastructure. Run it on virtualized platforms and public cloud suppliers, and you have what is usually alluded to as DevOps.

### Real-world Example of Immutable Infrastructure and Continuous Delivery
Now that we have covered the concepts, let’s walk through a simple scenario showing how simple immutable infrastructure can be. It can be triggered by a code check-in, which is the first step towards having a continuous delivery pipeline.

Deploying a simple PHP app on Heroku
Heroku is a developer-friendly platform for deploying applications. It is an easy first step to immutable infrastructure. With every application you create, you pick a runtime version, and that version is used until the system has to retire it, usually for support or security reasons.

Steps to build and deploy an application called yet-another-test-app:

#### Step 1 – Create the App
First let’s create a very simple application that prints the environment information:
```bash
$ mkdir test-app 
$ cd test-app 
$ echo "# test-app" >> README.md 
$ echo '' > index.php 
$ composer require "php:^5.6|^7.0"
```

#### Step 2 – Enable version control
```bash
$ git init 
$ git add . 
$ git commit -m "first commit"
```

#### Step 3 – Select the webserver
Now, we set the type of engine we run in on Heroku:
```bash
$ echo “web: vendor/bin/heroku-php-apache2” > Procfile
```

#### Step 4 – Create a repository
Now it’s time to create a server-side repository that can be accessed by other people (team members) and will be accessible to Heroku.

First, create an account on GitHub and create a public repository (so it is free). Next, push the local git repository to GitHub:
```bash
$ git remote add origin https://github.com/rishabkumar7/test-app.git 
$ git push -u origin master
```

#### Step 5 – Deploy to Heroku
Create an account on Heroku.com and follow the wizard to create an app that is connected to the repository you created on GitHub. Don’t worry, you get one dyno (web runtime) for free. Once you have connected it to your GitHub repository, there are two choices. The first is to enable “Automatic Deploys” which will redeploy the application anytime there is a commit on the GitHub repository master branch. This is the most basic form of continuous delivery you can have.

The second option is “Manual Deploy,” which is a one-time deploy. This takes advantage of Heroku’s immutable infrastructure.

Note: Heroku has an option for a continuous delivery pipeline that is simple and easy to enable and allows additional steps like reviews, and a staging environment that needs to be passed before production. This guide assumes that you are not enabling that feature.

#### Step 6 – Run the App
After a deploy, the application becomes available at https://test-app.h... this step complete, you have now taken advantage of immutable infrastructure created through Infrastructure as Code as part of the continuous delivery model.
