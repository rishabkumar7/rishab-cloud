---
title: "How I built a twitter bot on AWS and then again on Azure 😲🤖"
date: "2020-07-06T14:48:24.000Z"
description: "This bot was prepared with the help of this great article by Miguel Garcia.\nPrerequisites ⚙\n\nAn Azure VM\nTwitter Developer Account\nTwitter App Authentication Credentials\n\nFeel free to check the article by Miguel for all these requirements!\nWhat Is Tw..."
slug: "how-i-built-a-twitter-bot-on-aws-and-then-again-on-azure"
url: "/blog/how-i-built-a-twitter-bot-on-aws-and-then-again-on-azure/"
draft: false
tags:
  - "Azure"
  - "AWS"
  - "Python 3"
cover:
  image: "/images/blog/how-i-built-a-twitter-bot-on-aws-and-then-again-on-azure/sIrOs9sB1-56c501cac6.webp"
  alt: "How I built a twitter bot on AWS and then again on Azure 😲🤖"
hashnode:
  id: "5f26d2f89d473a7444cebaf8"
  url: "https://blog.rishabkumar.com/how-i-built-a-twitter-bot-on-aws-and-then-again-on-azure"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

**This bot was prepared with the help of this [great article](https://realpython.com/twitter-bot-python-tweepy/#how-to-make-a-twitter-bot-in-python-with-tweepy) by Miguel Garcia.**

## Prerequisites ⚙
- An Azure VM
- Twitter Developer Account
- Twitter App Authentication Credentials

Feel free to check [the article](https://realpython.com/twitter-bot-python-tweepy/#how-to-make-a-twitter-bot-in-python-with-tweepy) by Miguel for all these requirements!

## What Is Tweepy 🐣?
Tweepy is an open-source Python package that gives you a very convenient way to access the Twitter API with Python. Tweepy includes a set of classes and methods that represent Twitter’s models and API endpoints, and it transparently handles various implementation details, such as:
Data encoding and decoding
HTTP requests
Results pagination
OAuth authentication
Rate limits
Streams
If you weren’t using Tweepy, then you would have to deal with low-level details having to do with HTTP requests, data serialization, authentication, and rate limits. This could be time-consuming and prone to error. Instead, thanks to Tweepy, you can focus on the functionality you want to build.

## Going on with the #AzureCertified Bot 🤖

Below is the source code for the config module. It contains create_api(), a function that reads authentication credentials from environment variables and creates the Tweepy API object:

```py
# tweepy-bots/bots/config.py
import tweepy
import logging
import os

logger = logging.getLogger()

def create_api():
    consumer_key = os.getenv("CONSUMER_KEY")
    consumer_secret = os.getenv("CONSUMER_SECRET")
    access_token = os.getenv("ACCESS_TOKEN")
    access_token_secret = os.getenv("ACCESS_TOKEN_SECRET")

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth, wait_on_rate_limit=True, 
        wait_on_rate_limit_notify=True)
    try:
        api.verify_credentials()
    except Exception as e:
        logger.error("Error creating API", exc_info=True)
        raise e
    logger.info("API created")
    return api
```

This bot uses the previously introduced Tweepy stream to actively watch for tweets that contain certain keywords. For each tweet, if you’re not the tweet author, it will mark the tweet as Liked and then retweet it.

You can use this bot to feed your account with content that is relevant to your interests.

Bot Source Code

Below, you can see the full source code of this bot. It uses a stream to filter tweets that contain the word "#AzureCertified". Each tweet from the stream is marked as Liked and retweeted:

```py
#!/usr/bin/env python
# tweepy-bots/bots/favretweet.py

import tweepy
import logging
from config import create_api
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

class FavRetweetListener(tweepy.StreamListener):
    def __init__(self, api):
        self.api = api
        self.me = api.me()

    def on_status(self, tweet):
        logger.info(f"Processing tweet id {tweet.id}")
        if tweet.in_reply_to_status_id is not None or \
            tweet.user.id == self.me.id:
            # This tweet is a reply or I'm its author so, ignore it
            return
        if not tweet.favorited:
            # Mark it as Liked, since we have not done it yet
            try:
                tweet.favorite()
            except Exception as e:
                logger.error("Error on fav", exc_info=True)
        if not tweet.retweeted:
            # Retweet, since we have not retweeted it yet
            try:
                tweet.retweet()
            except Exception as e:
                logger.error("Error on fav and retweet", exc_info=True)

    def on_error(self, status):
        logger.error(status)

def main(keywords):
    api = create_api()
    tweets_listener = FavRetweetListener(api)
    stream = tweepy.Stream(api.auth, tweets_listener)
    stream.filter(track=keywords, languages=["en"])

if __name__ == "__main__":
    main(["#AzureCertified"])
```


## Building the Docker Image 🐳
To package your bot or application, you have to create a Dockerfile in the project’s root directory. This file contains a set of instructions used to create the Docker image containing your app.
This is how your project structure should look:
```
tweepy-bots/
│
├── bots/
│   ├── config.py
│   └── favretweet.py
│
├── requirements.txt
└── Dockerfile
```

You can use the following Dockerfile to create the image for the Fav & Retweet bot. It uses Python:3.7-alpine as the base image. We chose this image as the base since it’s very small and contains Python3.7 and pip. This Dockerfile then copies the bot code and the requirements.txt file to the image. Finally, the dependencies are installed inside the image using pip3:

```py
FROM python:3.7-alpine

COPY bots/config.py /bots/
COPY bots/favretweet.py /bots/
COPY requirements.txt /tmp
RUN pip3 install -r /tmp/requirements.txt

WORKDIR /bots
CMD ["python3", "favretweet.py"]
```

The final line says what command must be run when this image is used.

Now you can build the image using this command:

`$ docker build . -t fav-retweet-bot`

Finally, you can use the docker run command to test the image, passing it the environment variables holding the authentication credentials:

```bash
$ docker run -it -e CONSUMER_KEY="nMRNy54oWfdfssdfsV9AoNavy0I" \
 -e CONSUMER_SECRET="olAL5VAgZLWNspsdajff757kmsPEwuxpvLCLSR08DMa4O" \
 -e ACCESS_TOKEN="792518593-j7gWSqzQO31ju7Bfdsf7NlZeSENsuADGU9B90r" \
 -e ACCESS_TOKEN_SECRET="fusFsxvP5IglRckJ1I1why6017xMNkzxqBID48Azw0IoT" \
 fav-retweet-bot
```

## Deploying it to Azure VM
### Step 1: Export The Docker Image
From the computer where you have created the Docker image, run these commands to export it to a file. You’re going to use this file later to upload the image to your Azure VM:

`$ docker image save fav-retweet-bot:latest -o fav-retweet-bot.tar`

### Step 2: Install Docker on your Azure VM
Once you’re connected, run the following commands to install Docker on the VM:
```bash
AzureUser@TwitterBot:~$ sudo apt-get update
AzureUser@TwitterBot:~$ sudo apt install docker.io
AzureUser@TwitterBot:~$ sudo adduser ubuntu docker
```

### Step 3: Upload Your Bot’s Docker Image

From your local computer, upload the bot Docker image to your VM using scp. This can take some time depending on your internet connection:

`scp fav-retweet-bot.tar AzureUser@13.196.128.199:/`

Now connect to the Azure VM and load the docker image
`AzureUser@TwitterBot:~$ docker image load -i fav-retweet-bot.tar`

### Step 4: Run Your Bot’s Docker Image

The final step to deploy the bot is to run the Docker image in your Azure VM, passing it the authentication credentials.

You can do this using the docker command. Passing the flags -d and --restart-always assures that the bot will keep running if you disconnect from the SSH session or if the VM is restarted:
```bash
AzureUser@TwitterBot:~$ docker run -d --restart always \
-e CONSUMER_KEY="nMRNy54oWfdfssdfsV9AoNavy0I" \
 -e CONSUMER_SECRET="olAL5VAgZLWNspsdajff757kmsPEwuxpvLCLSR08DMa4O" \
 -e ACCESS_TOKEN="792518593-j7gWSqzQO31ju7Bfdsf7NlZeSENsuADGU9B90r" \
 -e ACCESS_TOKEN_SECRET="fusFsxvP5IglRckJ1I1why6017xMNkzxqBID48Azw0IoT" \
 fav-retweet-bot
```

Using docker ps, you can check that the bot is running and find its container id. Finally, using the docker logs command and the container id, you can check the output from the bot to see if it works properly:
```bash
AzureUser@TwitterBot:~$ docker logs f4aefe89a890
INFO:root:API created
INFO:root:Processing tweet id 1218244916562785538
INFO:root:Processing tweet id 1418486946762214918

```
Now, even if you disconnect from the SSH session or turn off your computer, the bot will continue to run on your Azure VM.

[https://github.com/rishabkumar7/AzureCertifiedBot](https://github.com/rishabkumar7/AzureCertifiedBot)
