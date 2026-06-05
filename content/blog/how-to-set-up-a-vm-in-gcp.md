---
title: "How to set up a VM in GCP ☁"
date: "2020-08-19T13:33:47.941Z"
lastmod: "2020-08-20T04:39:42.971Z"
description: "This is a three part series.\nIn this article, I'll walk you through one way that you can take your site and host it on your own server.\nStep 1: Linux server or a VM.\nYou'll need shell access to your server/VM. I would recommend micro instance in Goog..."
slug: "how-to-set-up-a-vm-in-gcp"
url: "/blog/how-to-set-up-a-vm-in-gcp/"
draft: false
tags:
  - "GCP"
  - "Linux"
  - "Cloud Computing"
  - "Cloud"
  - "2Articles1Week"
cover:
  image: "/images/blog/how-to-set-up-a-vm-in-gcp/7DOklAiws-13a009dfc9.jpeg"
  alt: "How to set up a VM in GCP ☁"
hashnode:
  id: "5f3d2a6e456c17320112606f"
  url: "https://blog.rishabkumar.com/how-to-set-up-a-vm-in-gcp"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

## This is a three part series.

In this article, I'll walk you through one way that you can take your site and host it on your own server.

Step 1: Linux server or a VM.
=============================

You'll need shell access to your server/VM. I would recommend micro instance in Google Cloud and if you are new you can almost get $300 in Google Cloud Credits. Also, check out their [free tier](https://cloud.google.com/free). You can also use a t2.micro instance in AWS, they offer [free tier](https://aws.amazon.com/free/) too. In this guide I will show how you can get a free linux instance:

You will get $300 credit to play around with for a year! It is more than enough to learn and play with everything Google Cloud offers.
(⚠ You will need to provide a credit card even if registering for free tier)

## Step 1: Create a new project:

After creating your account, create a new project where you will launch your resources, in our case, its a VM instance.
![Alt Text](/images/blog/how-to-set-up-a-vm-in-gcp/a8p4f015rn54vr2rwq0u-42b7607f8e.png)



## Step 2: Create a VM instance:
After the project is created, click on the little hamburger on the top left side, and go down to Compute Engine and select VM instances
![Alt Text](/images/blog/how-to-set-up-a-vm-in-gcp/s8nac8zsmjjiniy3c7p8-943be24913.png)

Click on create an instance.
After that, please choose the following settings for your VM:
![Alt Text](/images/blog/how-to-set-up-a-vm-in-gcp/f452b53zkxbs5ouotxyq-1d750db552.png)

If you scroll down, you will see the Firewall settings for your instance, check on both:
- Allow HTTP
- Allow HTTPS
![Alt Text](/images/blog/how-to-set-up-a-vm-in-gcp/8qpj9iqgesblrkniva0n-63a1516510.png)

Then click create!

## Step 3: Connect to the VM instance:

Wait for the instance to launch.
Once the instance has launched click on the SSH button and it should open a new tab with shell access to your Linux instance.
![Alt Text](/images/blog/how-to-set-up-a-vm-in-gcp/1e8u7lum1muyrp6wcxtl-ee863f3aa1.png)

You will also notice there is a public IP address assigned to your instance, take note of it, as this is where we will point our domain for our website.

******

Other cloud providers:
- [Azure](https://azure.microsoft.com/en-ca/free/)
- [Vultr](https://www.vultr.com/products/cloud-compute/#pricing)
- [Digital Ocean](https://www.digitalocean.com/)
- [Linode](https://www.linode.com/)

******

Please hit the 🖤 if it was helpful!
