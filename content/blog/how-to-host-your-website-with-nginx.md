---
title: "How to host your website with Nginx"
date: "2020-08-19T15:22:41.827Z"
lastmod: "2023-06-06T14:36:55.175Z"
description: "NGINX is a high‑performance, highly scalable, highly available web server, reverse proxy server, and web accelerator (combining the features of an HTTP load balancer, content cache, and more).\nNow, keep in mind that there are many options when it com..."
slug: "how-to-host-your-website-with-nginx"
url: "/blog/how-to-host-your-website-with-nginx/"
draft: false
tags:
  - "nginx"
  - "Web Development"
  - "server"
  - "Linux"
  - "2Articles1Week"
cover:
  image: "/images/blog/how-to-host-your-website-with-nginx/WOLovfqdh-9435bd43e3.jpeg"
  alt: "How to host your website with Nginx"
hashnode:
  id: "5f3d4473456c17320112615b"
  url: "https://blog.rishabkumar.com/how-to-host-your-website-with-nginx"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

[NGINX](https://www.nginx.com/) is a high‑performance, highly scalable, highly available web server, reverse proxy server, and web accelerator (combining the features of an HTTP load balancer, content cache, and more).

Now, keep in mind that there are many options when it comes to hosting static websites nowadays --- Github pages, any number of hosting providers, Amazon S3 or Cloudfront, Netlify etc.

---

Prerequisites:

* Linux server/VM - check [part 1 of this series](https://blog.rishabkumar.com/how-to-set-up-a-vm-in-gcp-cke1f3xb200iwvls16iqke0rw)
    
* Linux Command-line
    
* For the purposes of this guide, we'll use the domain example.com and the IP address 127.0.0.1 as examples.
    

---

# Step 2: Domain, pointing it to the right address

You need to point your domain to the new server you created. You can do this by creating an A record in your hosting provider's DNS settings, pointing your domain name (eg. example.com) to the server IP address (eg. 127.0.0.1). If you don't want to wait for the DNS to propagate, edit your /etc/hosts file to point your domain to the right IP address. (⚠ Don't forget switching out with your actual domain name and IP address as needed when you encounter these.)

# Step 3: Install NGINX

```bash
ssh into your server and install NGINX. If using Ubuntu, you can run:

sudo apt-get update

sudo apt-get install nginx
```

# Step 4: Website's static files

You can't deliver your website if the server doesn't have your files, so let's add your files to the server.

By default, NGINX expects your static files to be in a specific directory (which varies). You can override this in the configuration. For now, let's assume that you'll be putting your website's static files in the /var/www/ directory.

Create a directory in /var/www/ called example.com. This is where your static website's files will go.

Copy your website's static files into that folder. You can use the scp command from your local machine. cd into your website's directory and run:

`scp -r * root@127.0.0.1:/var/www/example.com`

(⚠ Don't forget to switch the 127.0.01 and example.com with values relevant to you.)

If you don't have a website just yet, you can create a file called index.html with some "Coming soon" text.

# Step 4: Configuring NGINX

We will now tell Nginx on how to serve our website.

cd into /etc/nginx/. This is the location for Nginx configuration files.

The two important directories are sites-available and sites-enabled.

* sites-available contains individual configuration files for all of your possible static websites.
    
* sites-enabled contains symbolic links to the configuration files that NGINX will actually read and run.
    

What we're going to do is create a configuration file in sites-available, and then create a symbolic link (a pointer) to that file in sites-enabled to actually tell NGINX to run it.

Create a file called example.com in the sites-available directory and add the following text to it: (you can use the touch command to create the example.com)

```bash
server {

 listen 80 default_server;

 listen [::]:80 default_server;

 root /var/www/example.com;

 index index.html;

 server_name example.com www.example.com;

 location / {

   try_files $uri $uri/ =404;

 }

}
```

(⚠ Don't forget using your own domain instead of example.com).

This file tells NGINX several things:

* Deliver files from the /var/www/example.com directory
    
* The main page is called index.html.
    
* Requests that are requesting example.com should be served by this server block.
    
* You might be wondering why www is listed separately. This tells nginx to also route requests starting with www to the site. There's actually nothing special about the www --- it's treated like any other subdomain.
    

Now that the file is created, we'll now create the symbolic link in the sites-enabled directory and in order to do so, we will use the following syntax:

`ln -s <SOURCE_FILE> <DESTINATION_FILE>`

The actual syntax will look like:

`ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com`

Now, restart NGINX to see your site! 🎉

`sudo systemctl restart nginx`

If it gives you an error ☹, there's likely a syntax error. You can stop here if you'd like, but you can also continue for some more optimization.

---

Please hit the ♥ if you found it useful! You can also follow me on [Twitter](https://twitter.com/rishabk7).
