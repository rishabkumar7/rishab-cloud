---
title: "How easy it is to deploy with Azure Static Web Apps"
date: "2021-03-21T15:01:04.993Z"
lastmod: "2023-05-30T00:53:19.418Z"
description: "Hello, amazing people 👋\nHope you all are doing well. For me, this week was exhausting due to work, but I am really happy since I got my Microsoft Azure AI Fundamentals Certification 😀\nhttps://twitter.com/rishabk7/status/1371513830082220036?s=20\n \nL..."
slug: "how-easy-it-is-to-deploy-with-azure-static-web-apps"
url: "/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/"
draft: false
tags:
  - "Web Development"
  - "Azure"
  - "100DaysOfCloud"
  - "Cloud Computing"
cover:
  image: "/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/5b8a087d-36ab-4a21-aff0-43dc2891eca7-51e2dcd353.png"
  alt: "How easy it is to deploy with Azure Static Web Apps"
hashnode:
  id: "60575fb05f8d512169727d68"
  url: "https://blog.rishabkumar.com/how-easy-it-is-to-deploy-with-azure-static-web-apps"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello, amazing people 👋

Hope you all are doing well. For me, this week was exhausting due to work, but I am really happy since I got my Microsoft Azure AI Fundamentals Certification 😀

[https://twitter.com/rishabk7/status/1371513830082220036?s=20](https://twitter.com/rishabk7/status/1371513830082220036?s=20)
Let's get started with the [Azure Static Web Apps](https://azure.microsoft.com/en-us/services/app-service/static/).

## Intro to Azure Static Web Apps

What is Azure Static Web Apps, in Microsoft's words, "A modern web app service that offers streamlined full-stack development from source code to global high availability."

Some of the great featured I love about it is Visual Studio Code extension for local development, full repository analysis, and native GitHub workflows for CI/CD.

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/cVTunppY_-9ac8d9e3b7.png)

## Deployment

Now, let's deploy a static web app with the same.

I had a face analysis web app that is written in JavaScript and HTML. Let's login to the Azure Portal and search for Static Web Apps:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/zlG_ecMXY-4b93130557.png)

Now, let's click on the "NEW" to get started with a new Static Web App:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/23HNTMr33-7f88dc5bae.png)

You will see the following screen, where you will need to pick a Subscription and add the following details:

* Resource Group
    
* Name (for the app)
    
* Region
    

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/8S4UpvVa3-560d1ab456.png)

For deployment, we will have to authenticate with our GitHub account:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/Hz2ge_p0-0ac257559d.png)

After connecting GitHub, you should be able to pick the repository and branch for deployment.

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/GvC1ArObt-f803e6429f.png)

Now, in the Build Details sections, you can see how many different options you have for Build Presets:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/wTMJsv6De-b89ee50396.png)

I will be choosing custom, since its a simple HTML/JS site. Also, I will be leaving other options blank, as I don't need them for now:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/x9owz9BI_-1818a90f62.png)

Click on the Review+Create, and that should take a few seconds to go through validation, and now you should be able to hit 'Create'

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/QTAScbO9o-d474fc41ec.png)

If we go to our GitHub repo, there should be a new directory: `.github/workflows/`

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/tJ0mkLlDo-2134250628.png)

In this directory there is a YAML file that is created by the Static Web App to handle the automatic deployments, as we make changes to the project.

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/69TxPcJaz-8b420a55bc.png)

And you should be able to see the Build jobs under the Action tab in the GitHub repo:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/jsp_woQuy-974b1a9f3e.png)

In basic terms, this mean if we make change to our website, commit and push those changes to the branch or if we merge a pull request to the branch it will be deployed and we won't have to do anything manually. The GitHub action setup by Static Web App will take care of it.

## Results

Once, the Job finishes, you should be able to navigate to the URL:

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/HuTqIb5pV-9169dad55e.png)

And voila!

![image.png](/images/blog/how-easy-it-is-to-deploy-with-azure-static-web-apps/hfnobkl9Y-7a41c17f32.png)

In the next blog, we will see how you can configure a custom domain and also get an SSL cert for your site.

Isn't it awesome 💜

If you have any questions, feel free to reach out [@rishabk7](https://twitter.com/rishabk7)
