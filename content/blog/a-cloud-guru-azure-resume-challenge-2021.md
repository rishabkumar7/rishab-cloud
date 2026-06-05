---
title: "A Cloud Guru Azure Resume Challenge 2021"
date: "2021-05-13T22:46:31.821Z"
description: "What is A Cloud Guru Azure Resume Challenge?\nGwyneth Peña-Siguenza, a Microsoft Azure MVP and Community Training Architect at A Cloud Guru, came up with doing the Cloud Resume Challenge, this time using Azure.\nHere is the challenge - https://bit.ly/3..."
slug: "a-cloud-guru-azure-resume-challenge-2021"
url: "/blog/a-cloud-guru-azure-resume-challenge-2021/"
draft: false
tags:
  - "Azure"
  - "challenge"
  - "JavaScript"
  - "NoSQL"
cover:
  image: "/images/blog/a-cloud-guru-azure-resume-challenge-2021/K0lKTt1wL-682430af6a.png"
  alt: "A Cloud Guru Azure Resume Challenge 2021"
hashnode:
  id: "609dac47b684eb4cd52c5205"
  url: "https://blog.rishabkumar.com/a-cloud-guru-azure-resume-challenge-2021"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

### What is A Cloud Guru Azure Resume Challenge?
[Gwyneth Peña-Siguenza](https://twitter.com/madebygps), a Microsoft Azure MVP and Community Training Architect at A Cloud Guru, came up with doing the Cloud Resume Challenge, this time using Azure.
Here is the challenge - https://bit.ly/32NvMax

### Taking the challenge
Currently, I work majorly in AWS as a DevOps Engineer. I have little experience with Azure Cloud and felt that this challenge was a great way to explore Azure services. I’m also someone that is continuing to learn upon DevOps skills, so I felt this was a great opportunity to build on those skillsets.
- [My Resume](https://resume.rishab.cloud)
- [GitHub](https://github.com/rishabkumar7/azure-cloud-resume)

### Completing the Challenge
I have already prepared for AZ-900 and passed the certification last year. Want to know how, check out my [blog post](https://blog.rishabkumar.com/how-i-passed-the-azure-fundamentals-with-mostly-free-content).
After doing this, I had a basic understanding of the components within Azure.
Getting into the challenge.
I started off first by creating a Resource Group where all of my services would reside in. So there are two sets - backend services and frontend (website).

Backend - Visitor Counter:
- CosmosDB (NoSQL database)
- Azure Functions (Node.js, LTS 14)
- JavaScript (node.js)

Frontend - Website:
- HTML/CSS
- Blob Storage
- CDN (Domain/DNS)

### Back-end:

#### CosmosDB
For this challenge, I chose to use CosmosDB. Cosmos DB is a serverless, NoSQL database that is simple to use and easy to configure. The challenge did not require anything overly complex, such as MongoDB, postgresql or MySQL.

First, create the CosmosDB Account. This will identify what type of API (Core (SQL), Azure CosmosDB for MongoDB APi, Cassandra, Azure Table, Gremlin) you will be using, Capacity mode (Provisioned throughput, serverless) and other options.

For API, I used CoreSQL and for Capacity mode, I choose provisioned throughput.

After creating the account, you’ll needed to create the database. To do this, you’ll need to create a Container. At the time of creating the container, you will need to give a name for the database id, container id and partition key.

After creating the container and database, you will need to create a Item within the database.

![image.png](/images/blog/a-cloud-guru-azure-resume-challenge-2021/pBUyGk5TI-053ba4cc58.png)

#### Azure Functions

I have had some experience using Azure Functions, when I built a [Resume API endpoint](https://blog.rishabkumar.com/how-i-built-a-resume-api-with-javascript-and-azure-functions).
For Azure Functions, I decided to create a very basic script using node.js, LTS 14.
I created the Function using Visual Studio Code. I found working with the Azure Function extension is pretty easy and allows you to test the code locally before publishing to Azure.

I used node.js and 14 LTS. The extension will create all the necessary resources once you push the Function to Azure. I used HTTP Trigger and for authorization level, I used function.

After creating the function, Inputs and outputs had to be added. To this, I went through the Integration section of my script. I created a Input and output to CosmosDB databse I created earlier.

Function code :
``` js
module.exports = async function (context, req, data) {
context.bindings.outputDocument = data[0];
context.bindings.outputDocument.count += 1;
context.res = {
    body: context.bindings.outputDocument.count
    };
}
```

### Front-end Website:

For this challenge, I used an old portfolio website that I built last year.
![ResumeApiBlog.gif](/images/blog/a-cloud-guru-azure-resume-challenge-2021/FzFk5K8aY-ceff78a3e0.gif)

In order to host it with Azure Blob storage, I created a storage account.
And since my Website code is already on GitHub, I planned to use GitHub action to continuously deploy my changes to Azure Blob storage, as soon as I merge them in GitHub repo.

Here is the documentation that I referred to - [Set up a GitHub Actions workflow to deploy your static website in Azure Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-static-site-github-actions)


#### GitHub action for FrontEnd:

``` yaml
name: Blob storage website CI

on:
    push:
        branches: [ main ]
        paths:
        - 'frontend/**'
    pull_request:
        branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:            
    - uses: actions/checkout@v2
    - uses: azure/login@v1
      with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Upload to blob storage
      uses: azure/CLI@v1
      with:
        azcliversion: 2.0.72
        inlineScript: |
            az storage blob upload-batch --account-name cloudresume -d '$web' -s frontend/
    - name: Purge CDN endpoint
      uses: azure/CLI@v1
      with:
        azcliversion: 2.0.72
        inlineScript: |
           az cdn endpoint purge --content-paths  "/*" --profile-name cloudresumecdn --name cloudresume --resource-group cloudresume
  # Azure logout 
    - name: logout
      run: |
            az logout
```
#### Updating Visitor Count:

So I included a basic JavaScript script to update the count on the website by calling the Azure Function.

``` js
window.addEventListener('DOMContentLoaded', (event) => {
  getVisitCount();
});


const functionApi = 'https://rishabresume.azurewebsites.net/api/HttpTrigger1?code=HDldDyHHM2jSTsRA283DMOL9FYdlsJYXg5Z3Hie25d7aYjWwaMsqTw==';

const getVisitCount = () => {
  let count = 7;
  fetch(functionApi)
    .then(response => {
      return response.json()
    })
    .then(response => {
      count = response;
      console.log("Hello 👋, you are visitor number - " + count);
      document.getElementById('counter').innerText = count;
    }).catch(function (error) {
      console.log(error);
    });
  return count;
}
```
#### CORS errors
So I ran into CORS error, here is how to prevent it.
Under the Function App, click CORS on the sidebar.
CORS is a setting on the Function App which lists URLs that are allowed to interact with the backend.
Your static URL for the frontend website needs to be on the list.

#### Custom Domain and CDN
So after creating the website and deploying it to the Azure Storage, we need a CDN endpoint. As you might see, the GitHub action has some code to purge the CDN, that is because we want the changes, that are deployed to the website after some code changes to not stay cached in CDN and hence it purges the content.
In order to create a CDN endpoint, please refer to - [Integrate a static website with Azure CDN](https://docs.microsoft.com/en-us/azure/storage/blobs/static-website-content-delivery-network).
Now under the CDN settings you will see `custom domain` as an option:
![image.png](/images/blog/a-cloud-guru-azure-resume-challenge-2021/1AJhhsLMm-9380825cf3.png)
In order to add a custom domain, you first need to point you domain to the CDN endpoint.
For DNS, I use Route53, so I just had to create a CNAME record for resume.rishab.cloud with value `cloudresume.azureedge.net`. Now I was able to add the custom domain in the CDN options, it also provisions the SSL certificate.

### What was the Hardest Part?
The hardest part for this challenge was configuring the Azure Functions. The input and output integration for Cosmos DB and having the function to update the count in Cosmos DB was tricky, but thanks to the Microsoft docs and also the ACG discord community.

### Which Part did I enjoy?
I enjoyed figuring out the Function part to communicate with the Azure Cosmos DB, and troubleshooting different errors in my JavaScript function.
