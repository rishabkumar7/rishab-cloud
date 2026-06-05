---
title: "FastAPI as AWS Lambda Function"
date: "2025-02-21T21:23:35.647Z"
description: "As a fan of both FastAPI and AWS Lambda, I wanted to share a quick tutorial on how to combine these two awesome technologies. If you're not familiar with AWS Lambda, it's a serverless compute service that lets you run code without managing servers. A..."
slug: "fastapi-as-aws-lambda-function"
url: "/blog/fastapi-as-aws-lambda-function/"
draft: false
tags:
  - "FastAPI"
  - "Python"
  - "AWS"
cover:
  image: "/images/blog/fastapi-as-aws-lambda-function/ade6b1eb-37d7-4cca-993d-8c2d200bfc90-7a7e380de2.png"
  alt: "FastAPI as AWS Lambda Function"
hashnode:
  id: "67b8eed73cd3e576afe283e6"
  url: "https://blog.rishabkumar.com/fastapi-as-aws-lambda-function"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

As a fan of both [FastAPI](https://fastapi.tiangolo.com/) and [AWS Lambda](https://aws.amazon.com/lambda/), I wanted to share a quick tutorial on how to combine these two awesome technologies. If you're not familiar with AWS Lambda, it's a serverless compute service that lets you run code without managing servers. And FastAPI? It's one of my favorite Python frameworks for building APIs!

In this article, I'll show you how to deploy a FastAPI application to AWS Lambda using [Mangum](https://pypi.org/project/mangum/). Let's dive in!

## Prerequisites

* [Python 3.10 installed](https://www.python.org/downloads/)
    
* [AWS account](https://signin.aws.amazon.com/signup?request_type=register)
    
* [Basic understanding of FastAPI](https://youtu.be/LVuxmQfqivA?si=lC-BVcTcRyzM7JOb)
    
* VS Code (or your favorite code editor)
    

## Project Setup

First, let's create the directory for our project:

```bash
# Create project directory
mkdir fastapi-lambda-function 
cd fastapi-lambda-function 
```

Create and activate virtual environment

```bash
python -m venv venv 
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Create two files in your project:

* `requirements.txt`
    
* `main.py`
    

In `requirements.txt`, add these dependencies:

```bash
fastapi==0.99.0  # Using this version due to current compatibility
mangum
```

Install the packages:

```bash
pip install -r requirements.txt
```

## Creating Our FastAPI Application

In `main.py`, let's create a basic FastAPI app:

```bash
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, this is my first FastAPI app running on AWS Lambda!"}

# Add another route for demonstration
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# This is the key for Lambda!
handler = Mangum(app)
```

This basic FastAPI has two endpoints, a root and pretty basic `/items` endpoint. But as you can see the last line with handler being Mangum, that is how AWS will trigger this Lambda function.

## Packaging for AWS Lambda

Now comes the fun part - packaging our application for Lambda! We need to create a ZIP file containing all our dependencies and code.

On Windows you can use PowerShell:

```bash
# Zip dependencies
Compress-Archive -Path "venv/Lib/site-packages/*" -DestinationPath "aws-lambda.zip"

# Add main.py to the zip
Compress-Archive -Path "main.py" -Update -DestinationPath "aws-lambda.zip"
```

On Unix/Linux:

```bash
cd venv/lib/python3.10/site-packages
zip -r ../../../../aws-lambda.zip .
cd ../../../../
zip -g aws-lambda.zip main.py
```

## Deploying to AWS Lambda

1. Go to [AWS Console](https://console.aws.amazon.com/) and search for Lambda
    
2. Click "Create function"
    
    ![](/images/blog/fastapi-as-aws-lambda-function/0ee11fac-ff56-4f4c-b762-2314ffe68d93-4b10cd7915.png)
    
3. Choose "Author from scratch"
    
4. Configure the basics:
    
    * Name: `fastapi-lambda`
        
    * Runtime: Python 3.10
        
    * Architecture: x86\_64
        
    * Default execution role: Create new basic Lambda role  
        
        ![](/images/blog/fastapi-as-aws-lambda-function/c09ca265-7de0-436d-a51a-ffd4647c5873-7994c7ebbc.png)
        
5. Enable Function URL:
    
    * Click "Configuration" tab
        
    * Find "Function URL" and enable it
        
    * Auth type: NONE (for this demo)
        
    * Click "Save"
        
        ![](/images/blog/fastapi-as-aws-lambda-function/45c36928-96fb-401b-8e3b-95d00dfd53c3-471df3c57d.png)
        
6. Upload your code:
    
    * Go to "Code" tab
        
    * Click "Upload from" and choose ".zip file"
        
    * Upload your `aws-lambda.zip`
        
    * Click "Save"
        
        ![](/images/blog/fastapi-as-aws-lambda-function/f5dd299d-5f1d-45ba-8886-c44b1dc0d32e-c86647677e.png)
        
7. Configure the handler:
    
    * Go to "Runtime settings"
        
    * Click "Edit"
        
    * Change Handler to: `main.handler`
        
    * Click "Save"
        

![](/images/blog/fastapi-as-aws-lambda-function/1243c2a9-2133-46c8-a7a7-b8e332bd821a-0249dc241e.png)

![](/images/blog/fastapi-as-aws-lambda-function/8f5ddb00-4651-4093-85e3-d27c01400983-c077f9c8ce.png)

## Testing Your API

Once deployed, you'll get a Function URL. Try these endpoints:

* `<your-function-url>/` - Should return your welcome message
    
* `<your-function-url>/items/1` - Should return `{"item_id": 1, "q": null}`
    
* `<your-function-url>/items/100` - Should return `{"item_id": 100, "q": null}`
    

## What's Next?

This is just a basic example of what you can do with FastAPI and AWS Lambda. In production, you might want to consider:

* Setting up proper authentication
    
* Using API Gateway for more control
    
* Implementing proper error handling
    
* Setting up CI/CD pipelines
    

If you found this helpful, don't forget to follow me for more cloud and DevOps content! Check out my [YouTube channel](https://youtube.com/@rishabincloud) where I have a detailed video walkthrough of this tutorial.

[https://youtu.be/b0XCH04K8eQ?si=dkcxSd0uyucTL1Kz](https://youtu.be/b0XCH04K8eQ?si=dkcxSd0uyucTL1Kz)
## Common Issues

* If you're getting errors with the latest FastAPI version, stick to version `0.99.0` as specified in the requirements.
    
* Make sure your handler name matches exactly `main.handler`.
    
* Check your Lambda execution role has proper permissions.
    

Happy coding!

P.S. All code from this tutorial is available in my [GitHub repo](https://github.com/rishabkumar7/fastapi-aws-lambda).
