---
title: "Adding custom domain and SSL certificate Azure Static Web Apps"
date: "2021-04-22T15:42:42.517Z"
description: "Hello amazing people 👋\nSo we finally had our website running the last article. Oh not sure what I am talking about, check out the first part of the blog here 👇\nhttps://blog.rishabkumar.com/how-easy-it-is-to-deploy-with-azure-static-web-apps\nNow let..."
slug: "adding-custom-domain-and-ssl-certificate-azure-static-web-apps"
url: "/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/"
draft: false
tags:
  - "Azure"
  - "Web Development"
  - "Cloud"
cover:
  image: "/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/EHfu2oLZU-d3f8fd36e6.png"
  alt: "Adding custom domain and SSL certificate Azure Static Web Apps"
hashnode:
  id: "60819972fea38e52a9c58960"
  url: "https://blog.rishabkumar.com/adding-custom-domain-and-ssl-certificate-azure-static-web-apps"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello amazing people 👋

So we finally had our website running the last article. Oh not sure what I am talking about, check out the first part of the blog here 👇

[https://blog.rishabkumar.com/how-easy-it-is-to-deploy-with-azure-static-web-apps](https://blog.rishabkumar.com/how-easy-it-is-to-deploy-with-azure-static-web-apps)
Now let's setup a custom domain and make sure we have the SSL certificate for it.

## Setting up the custom domain

Let's navigate to the Static Web App that we created in the last article.

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/QWexmG9uI-dab156f46f.png)

And in the blade, you should see `Custom Domains` section. Let's click that

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/52PyAFb9a-63bb23ac9b.png)

Now, if we click on the `Add`, it will open a tab on the right side for you to add the custom domain name, for this demo I will be using `faced.rishab.cloud`.

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/mMeCt5925-0a0c238781.png)

At this point, we have to update our Domain Name provider, in my case it's [AWS-Route53](https://aws.amazon.com/route53/). So I will create a CNAME record in Route53 to point to that value provided in Azure Static Web App

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/35d8dBMSv-2962ef3506.png)

If you use a different domain provider, the UI for adding the CNAME record should still look pretty similar.

Now, if we click on `Validate` after adding the CNAME record, it should succeed.

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/XE1VniJlX-d9da37b8f9.png)

And after the validation has succeeded, click on add.

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/VmR7TVzRt-5231e476c2.png)

After few minutes of wait, you will see the domain is added:

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/AvFgF7sAV-6aa5e7ef38.png)

Let's navigate to our site now!

![image.png](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/ZY587nKts-a339ed9b37.png)

Did you notice something 🤔?

Yes, it also got a SSL certificate for the site, Azure Static Web Apps provisioned a certificate. 

![SSL.gif](/images/blog/adding-custom-domain-and-ssl-certificate-azure-static-web-apps/ssl-https-gif-35bd8d2445.gif)

That's all for this article!
Hope you found it helpful, please feel free to reach out if you have any concerns, my twitter - [@rishabk7](https://twitter.com/rishabk7)
