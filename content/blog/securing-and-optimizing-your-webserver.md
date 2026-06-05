---
title: "Securing and Optimizing your webserver"
date: "2020-08-20T04:37:22.958Z"
description: "This is the last part of the series!\nif you haven't read the first two articles, here they are :\n\nHow to set up a VM in GCP ☁\nHow to host your website with Nginx ⚙\n\nIn this article, we will optimize our web server and secure our site, which is being ..."
slug: "securing-and-optimizing-your-webserver"
url: "/blog/securing-and-optimizing-your-webserver/"
draft: false
tags:
  - "nginx"
  - "Web Development"
  - "Linux"
  - "SSL"
  - "2Articles1Week"
cover:
  image: "/images/blog/securing-and-optimizing-your-webserver/1W0lF-sB2-1445fd53aa.png"
  alt: "Securing and Optimizing your webserver"
hashnode:
  id: "5f3dfe6a4ef4e73944d51f7a"
  url: "https://blog.rishabkumar.com/securing-and-optimizing-your-webserver"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

This is the last part of the series!
if you haven't read the first two articles, here they are :
- [How to set up a VM in GCP ☁](https://blog.rishabkumar.com/how-to-set-up-a-vm-in-gcp-cke1f3xb200iwvls16iqke0rw)
- [How to host your website with Nginx ⚙](https://blog.rishabkumar.com/how-to-host-your-website-with-nginx-cke1j2phg00svvls1hcdmd9ka)

In this article, we will optimize our web server and secure our site, which is being served by Nginx.
Enable HTTPS
============

Now that you can get free SSL certs from [LetsEncrypt](https://letsencrypt.org/), there's really no reason why you shouldn't have HTTPS enabled for your website. Not only it insures security, there's significant performance opportunities via HTTP/2 (browsers require encryption to enable this).
Step 1: Get SSL cert
---------------------------

You can buy a single-domain certification or a wildcard certification if you plan on securing subdomains.

You can get them free via [LetsEncrypt](https://letsencrypt.org/):
```
sudo apt-get install software-properties-common\
sudo add-apt-repository ppa:certbot/certbot\
sudo apt-get update\
sudo apt-get install python-certbot-nginx\
sudo certbot --nginx certonly
```

Following the instructins will install certs in `/etc/letsencrypt/live/example.com/`;

Enable auto-renewal for certificates:

Edit the `crontab` and create a CRON job to run the renewal command:

`sudo crontab -e`

Add the following line:

`17 7 * * * certbot renew --post-hook "systemctl reload nginx"`

Step 2: Using the SSL cert for your website
-------------------------------------------------------

Once you've acquired your SSL certs, you'll need to let NGINX know to use them.

Let's modify the configuration file we created for `example.com` to use SSL.

Inside the `server` block, change the paths to point to the directory where certificate file and the key file are stored (usually store in the `/etc/nginx/certs/` directory):

```
server {\
   # ...previous content here\
   ssl on;\
   ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;\
   ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

This tells nginx to enable SSL and use the specified key and certificate for that server.

We also now face an issue: Port 80, what we're currently listening to, is for HTTP connections. SSL connections use port 443. So in order to use 443, we listen in 443 instead of 80.

```
server {\
   listen 443 default_server;\
   listen [::]:443 default_server;\
   #... all other content\
}
```

Now we'll redirect HTTP requests to the HTTPS. Add the following new server block after the HTTPS (443) server block:

```
server {\
       listen 0.0.0.0:80;\
       server_name example.com [www.example.com](http://www.example.com/);\
       rewrite ^ [https://$host$request_uri](https://%24host%24request_uri/)? permanent;\
}
```

This will redirect all requests to `example.com` and `www.example.com` on port 80 to the HTTPS URL.

Restart Nginx service

`sudo systemctl restart nginx`

Now, try going to these URLs:

-   http://example.com
-   https://example.com

They should be secured via HTTPS.

* * * * *

Improve performance
===================

Enable HTTP/2
-------------

HTTP/2 allows browsers to request files in parallel, greatly improving the speed of delivery. You'll need HTTPS enabled. Edit your browser configuration file, adding `http2` to the `listen` directive, then restart NGINX:

```
server {\
   listen 443 http2 default_server;\
   listen [::]:443 http2 default_server;\
   #... all other content\
}
```

*****
Please hit the ♥ if you found it useful!
