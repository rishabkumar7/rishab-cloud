---
title: "Deploying Grafana to Azure’s Web Apps for Containers"
date: "2023-08-21T15:41:17.684Z"
description: "Hello Cloud adventurers, I have been on a learning journey this year with containerization, specifically docker. Continuing the series of blogs, I wanted to try deploying Grafana to Azure but as a docker container. I know there are different ways and..."
slug: "grafana-on-azure-web-app-containers"
url: "/blog/grafana-on-azure-web-app-containers/"
draft: false
tags:
  - "Azure"
  - "containers"
  - "Docker"
  - "Grafana"
cover:
  image: "/images/blog/grafana-on-azure-web-app-containers/7bfe3341-fcf0-4792-999e-5f3549742bdc-bacc49f975.png"
  alt: "Deploying Grafana to Azure’s Web Apps for Containers"
hashnode:
  id: "64e3859d2b23ae260f2bd5d0"
  url: "https://blog.rishabkumar.com/grafana-on-azure-web-app-containers"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello Cloud adventurers, I have been on a learning journey this year with containerization, specifically docker. Continuing the series of blogs, I wanted to try deploying Grafana to Azure but as a docker container. I know there are different ways and different services within Azure that you can use to deploy a container, but I will be using [Azure Web Apps.](https://azure.microsoft.com/en-ca/products/app-service/web)

Deploying Grafana to Azure’s Web Apps for Containers is a straightforward process:

* A storage account
    
* An Azure Files share
    
* Initiate an empty Sqlite database
    
* Web Apps for Containers Azure App Service
    
* Mount the Azure Files share
    
* Set an environment variable
    

Let’s get started.

## Create a Storage Account

Begin by creating an Azure Storage account. This is where we will create the File Share later. You might ask, why do we need a File Share?

If I deployed Grafana as a container, the Sqlite database (and plug-ins) would be lost as soon as the container is reset. Hence, we will be using the File Share as storage for our Grafana database.

I have created `grafana-rg` as the resource group where all the resources will be deployed for this blog post. For the Storage Account, make sure you use a unique name and I went with `Standard` performance with `Geo-Redundant Storage (GRS)`. I left everything else as default.

![Creating a Storage Account in Azure](/images/blog/grafana-on-azure-web-app-containers/e530bd26-dc26-42c9-b98b-26dae27c92b4-6eaf10e5b1.png)

## Create an Azure Files Share

Navigate to your newly created storage account and scroll down to `File Shares`.

![Azure Storage Account with File Shares highlighted on the Configuration Blade.](/images/blog/grafana-on-azure-web-app-containers/14c01326-0e5e-4407-9904-2d5e7dc2633d-dcb0ec246b.png)

Click on the + File share button.

For the Name, I chose `grafana-storage` you can choose whatever you like. I went with the `Transaction optimized` tier. Everything else was left to default.

![Creating new File Share with Transaction optimized Tier](/images/blog/grafana-on-azure-web-app-containers/994fc10c-0f49-4295-99bc-b1b5e69f20cf-b10d4c0875.png)

## Initiate an empty Sqlite database

I found it the hard way that if we leave Grafana to create the database, it will run into a database lock error. To overcome this, we’re going to create a Sqlite database manually and then, using the Azure CLI, we will upload the database to the file share.

On a Windows machine, you can run the following commands.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Provided you’ve already installed <a target="_blank" rel="noopener noreferrer nofollow" href="https://chocolatey.org/install" style="pointer-events: none">choco</a>.</div>
</div>

If you are on macOS, Sqlite is already installed and, therefore, you can skip the first command.

Also, you’ll need [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated with your Azure account.

```bash
choco install sqlite
```

```bash
sqlite3 grafana.db 'PRAGMA journal_mode=wal;'
```

Now, let's copy the `grafana.db` to our File Share. We will use the `azcopy` command.

```bash
az login az storage copy -s .\grafana.db -d https://<storage_account>.file.core.windows.net/<file_share> --subscription <subscription_name>
```

Replace &lt;storage\_account&gt;, &lt;file\_share&gt;, and &lt;subscription\_name&gt;, with the appropriate values: the name of your storage account, the name of your file share and your subscription’s id or name.

![AZ Copy command output, copied the grafana.db over to Azure File Share](/images/blog/grafana-on-azure-web-app-containers/deb8fe0f-0e48-4c53-a2a8-95956c8029ab-602eff2763.png)

## App Service

Create a new Azure web application that publishes a Docker Container and choose Linux for the OS. Choose a pre-existing Linux App Service Plan or create a new one.

There is a Free F1 Plan, but I went with Basic B1.

![Creating a Web App, first settings page with Docker Container and Pricing plan as Basic B1.](/images/blog/grafana-on-azure-web-app-containers/65f7c12d-138a-4671-8cfb-84fb68904dcc-a536202839.png)

For the Docker options, we’re going to leave the defaults for the moment. We’ll update this later once we have our environment fully configured. All other options we will the default.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Make sure the <code>Enable Public Access</code> is checked.</div>
</div>

![Using the default settings for Web App Container under Docker tab](/images/blog/grafana-on-azure-web-app-containers/a243fa3c-bc2b-41fc-b3cb-81a1387a5bd1-4060ec28f3.png)

Once the Azure Web App has been successfully configured, you can access it by the app service URL. You should see the nginx message.

![Azure Web App page with Default Domain and Configuration highlighted](/images/blog/grafana-on-azure-web-app-containers/68700be8-aa70-4620-b04c-c6ee69a99196-cedda4c818.png)

Now we will configure the Web App container to use the Azure File Share as storage.

## Mount the Azure Files share

In the Azure portal, on the App Service’s blade, click on `Configuration`, then `Path mappings`.

![Azure Web App Configuration window, with Path mappings highlighted](/images/blog/grafana-on-azure-web-app-containers/0b2e3ece-3d5c-4fe1-846a-0117f2c97339-bbb7bb290c.png)

Now click on `+ New Azure Storage Mount`.

![Azure Web App configuration: adding New Azure Storage Mount](/images/blog/grafana-on-azure-web-app-containers/f666631a-e042-4d50-830e-806f3044be63-c481cfae0b.png)

Name the storage mount whatever you’d prefer and choose the *Storage Account* you created before, `Azure Files` for *Storage Type*, and the Azure File share created before for the *Storage Container*. Finally, most important, for the *Mount path*, type in `/var/lib/grafana`.

![New Azure Storage Mount for Azure Web App with all the parameters filled in](/images/blog/grafana-on-azure-web-app-containers/599ff125-67ee-46b9-b58a-2bc267f17028-4982fba269.png)

Click `OK` then `Save` at the top.

We just attached our Azure File share to our container and it will be mounted at `/var/lib/grafana` which is Grafana’s default file path for the database and its plugins. This means, should our container be restarted for any reason, none of our settings will be lost.

## **Set an Environment Variable**

Now we have Grafana storing the database in our `/var/lib/grafana` mount path. However, it will not use the `PRAGMA` flag that we used earlier, therefore, we will experience [database locking](https://github.com/grafana/grafana/issues/16638).

Grafana allows us to overwrite default configuration variables by leveraging **environment variables**. So, we’re going to use Grafana’s default database connection string, but append the necessary flag.

Click on the `Configuration` blade once again for your Web App(you should still be on the **Configuration** blade from the previous step).

Now, choose `Application settings` and add a `+ New application setting.`

![Azure Web App Configuration page with Application Settings highlighted](/images/blog/grafana-on-azure-web-app-containers/1a9cb91f-4ecf-440f-a1e4-96b1a6f97f07-6f795ae1fd.png)

For the setting, enter the following:

```bash
Name: GF_DATABASE_URL
Value: sqlite3:///var/lib/grafana/grafana.db?cache=private&mode=rwc&_journal_mode=WAL
```

Leave the `Deployment slot setting` unchecked.

![Adding new application setting for Azure Web App](/images/blog/grafana-on-azure-web-app-containers/3478b7da-09bb-46b9-994d-f3f5963a3bfd-251ec213fc.png)

Make sure you click `Save`.

![Azure Web App Configuration page with Save button highlighted](/images/blog/grafana-on-azure-web-app-containers/4c2eadd5-65e9-4a88-820e-b3d49ff70307-9e6a4242cd.png)

Awesome, now we have the environment configured, but we need to update our container’s image source.

In the App Service blade, under `Deployment Center`, choose `Settings`.

![Azure Web App Deployment Center page: changing the container settings](/images/blog/grafana-on-azure-web-app-containers/44f79ab4-cc35-4be2-ae70-a76b7c0262ab-aec7ce86d3.png)

By default, the `Full Image Name and Tag will` be set to `nginx`(which was set when we created the App Service).

We want to use the Grafana Container Image, I have my own docker image for Grafana that I want to use, but you can use the default one that is provided by Grafana.

Curious on how to create your own Docker image, [watch this video on how I did it.](https://youtu.be/tvIcZZBvnOk)

![Docker Hub with my own grafana-container image](/images/blog/grafana-on-azure-web-app-containers/3cdab5b0-7e3f-41a8-9ec2-cb349ac0e9c9-d18a8c551c.png)

Change the registry source to `Docker Hub`, and the image to `grafana/grafana` if you want to use the official [Grafana Image](https://hub.docker.com/r/grafana/grafana).

Click `Save`.

![Azure Web App Deployment Center Container settings filled in with appropriate values for my grafana image](/images/blog/grafana-on-azure-web-app-containers/f76ffe28-30b8-4c3e-a10f-8d51d2a6a86d-70e9d08e8f.png)

It may take a moment for Azure to pick up the changes once you submit them. You can click `Refresh` a few times and check the logs to ensure the container was deployed correctly.

![Azure Web App portal with Refresh and Logs button highlighted](/images/blog/grafana-on-azure-web-app-containers/3125a882-7c4c-42ef-a885-7f09b60a5dad-5ae8f848b0.png)

Now let's visit the Web App URL to see the changes.

![Grafana Login screen when accessing the Azure Web App URL](/images/blog/grafana-on-azure-web-app-containers/f16d8122-1156-4333-8ae2-2a9af3231142-942a6b8d8e.png)

## **Conclusion**

We did it! We now have Grafana deployed to Azure Web Apps for Containers with Azure File Share as storage, making it redundant, not prone to losing data on container restarts and the ability to scale to support the necessary load.
