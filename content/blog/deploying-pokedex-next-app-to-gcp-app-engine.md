---
title: "Deploying Pokedex Next App to GCP App Engine"
date: "2021-02-03T08:05:37.236Z"
description: "Hello amazing people 👋\nHope everyone is doing great!\nThis week I have started looking into GCP App engine and have been trying to build something to test out the platform.\nSo I decided why not deploy the Pokedex app that we created last week, on the..."
slug: "deploying-pokedex-next-app-to-gcp-app-engine"
url: "/blog/deploying-pokedex-next-app-to-gcp-app-engine/"
draft: false
tags:
  - "GCP"
  - "app development"
  - "Next.js"
  - "Cloud"
cover:
  image: "/images/blog/deploying-pokedex-next-app-to-gcp-app-engine/HXhqX658K-d8ec004254.png"
  alt: "Deploying Pokedex Next App to GCP App Engine"
hashnode:
  id: "601a5951dc773e253be7df3a"
  url: "https://blog.rishabkumar.com/deploying-pokedex-next-app-to-gcp-app-engine"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello amazing people 👋

Hope everyone is doing great!
This week I have started looking into GCP App engine and have been trying to build something to test out the platform.

So I decided why not deploy the Pokedex app that we created last week, on the App Engine.

If you haven't checked it out, last week we deployed the pokedex app to a docker container.

[https://blog.rishabkumar.com/pokedex-with-nextjs-and-serving-it-with-docker](https://blog.rishabkumar.com/pokedex-with-nextjs-and-serving-it-with-docker)
[https://github.com/rishabkumar7/next-pokedex](https://github.com/rishabkumar7/next-pokedex)
## Getting started:

You can either use the GCP Cloud Shell through the web portal to follow along or download the [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts):

![image.png](/images/blog/deploying-pokedex-next-app-to-gcp-app-engine/puIyCl3zV-2ac4acff4b.png)

The Google Cloud SDK is installed locally on your computer that allows you to deploy applications  and manage various things on your Google Cloud.

Now make sure you have cloned the Pokedex app locally or in the Cloud Shell:

`git clone https://github.com/rishabkumar7/next-pokedex.git`

If you have not set up a project and application to run this demo, follow the steps below. Otherwise, skip to the next section.

First, authenticate to GCP if you have not already, only if you are using the SDK:

`gcloud auth login`

Using the GCP CLI, create a new project and application. Replace PROJECT-NAME with your own.

```
gcloud projects create PROJECT-NAME
gcloud config set project PROJECT-NAME
gcloud app create
```

Wait a few minutes while Google provisions resources. While you are waiting, enable the Cloud Build API for your project by visiting the Cloud Build API page for your project.


## Building and Deploying:

Now make sure you have the `gcp-app-engine` branch checked out.
`cd next-pokedex`
`git checkout gcp-app-engine`

In the app code, you should see a new file named `app.yaml`.

```
env: standard
runtime: nodejs12
service: default

handlers:
  - url: /.*
    secure: always
    script: auto
```

Breaking down the `app.yaml`:
 - The newest version of nextjs has dependencies that require nodejs12, so setting the runtime to nodejs12
- the /.* ensures access to all folders and sub folders within the build folder
- secure always ensures https is used
- script auto tells what files to load instead of index.js

Now we have also added the `next.config.js`
```
module.exports = {
  distDir: 'build',
}
```
Google App Engine doesn’t recognize .next folder so we changed the folder from .next to `build` using the distDir parameter in the next.config.js


Now if we look at the `package.json`, it's bit different then before, so we have modified the `scripts` section:

```
"build": "rm -rf ./build && NODE_ENV=production next build",
"start": "next start -p 8080",
"deploy": "npm run build && gcloud app deploy"
```

So let's break it down:
- the build script command removes the existing build folder and then runs a new build, this prevents nextjs making multiple versions and running into issues uploading many unnecessary previous builds during deploy
- the deploy script command runs the build script and the app deploy command

Let's deploy our app now.
If you run the `npm run deploy`

It will build the next app and also deploy it to the app engine. You should see the URL to your app in the ouput:
```
Setting traffic split for service [default]...done.
Deployed service [default] to [https://gcp-ace-302412.ue.r.appspot.com]
```
![gif.gif](/images/blog/deploying-pokedex-next-app-to-gcp-app-engine/giphy-d5ff874f38.webp)

And you have the Pokedex Next App being served by GCP App engine.


![image.png](/images/blog/deploying-pokedex-next-app-to-gcp-app-engine/998DEIayU-bf54539dd0.png)
