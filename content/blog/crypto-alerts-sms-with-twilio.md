---
title: Crypto Alerts via SMS using Twilio
type: page
description: Sending text alerts so I don’t have to constantly monitor the Crypto!
topic: crypto, twilio, python
date: 2022-08-22
---
## Crypto Alerts via SMS using Twilio

Sending text alerts so I don’t have to constantly monitor the Crypto!
We all know how volatile the crypto has been, but I get anxious for checking it too often, hence I have built a sms alerting system that sends my crypto prices every morning.
Let's get into the tech I used:

## Tech Stack

- Twilio Account
- CoinGecko API
- Python
- GitHub Actions

Moving onto the demo.

The first thing you’re going to want to do is create a python script that will send an automated text to your phone number. Twilio will allow us to send these SMS alerts, and offers credits with a free trial (no credit card info needed!). Feel free to check out how Twilio credits work on [the website](https://www.twilio.com/try-twilio).
After creating the Twilio account, you will need to get a [phone number](https://www.twilio.com/phone-numbers). Now let's write some code, we will be using python, let's name our file 'main.py'.

### Importing modules

``` python
import os
import json
from twilio.rest import Client
from pycoingecko import CoinGeckoAPI
```

### Variables

```python
#variables
account_sid = os.environ['account_sid']
auth_token = os.environ['auth_token']
to_number = os.environ['to_number'] #input your personal phone number as variable
from_number = os.environ['from_number'] #input your twilio number as variable

client = Client(account_sid, auth_token)
```

### Crypto Prices

Let's get the crypto currency prices, utilizing the CoinGecko API

```python
#get crypto prices (Bitcoin and Ethereum)

crypto_prices = cg.get_price(ids = 'bitcoin,ethereum', vs_currencies = 'usd')
crypto_prices_text = json.dumps(crypto_prices)
print (crypto_prices_text)
```

### Send it as a sms

Now, we have the crypto prices, let's send it as an SMS using the Twilio client

```python
client.api.account.messages.create(
to = to_number, 
from_ = from_number,
body=crypto_prices_text) #input text message
```

Putting it all together, it should look something like this:

```python
#imports
import os
import json
from twilio.rest import Client
from pycoingecko import CoinGeckoAPI

cg = CoinGeckoAPI()

#variables
account_sid = os.environ['account_sid']
auth_token = os.environ['auth_token']
to_number = os.environ['to_number'] #input your personal phone number as variable
from_number = os.environ['from_number'] #input your twilio number as variable

client = Client(account_sid, auth_token)

#get crypto prices (Bitcoin and Ethereum)

crypto_prices = cg.get_price(ids = 'bitcoin,ethereum', vs_currencies = 'usd')
crypto_prices_text = json.dumps(crypto_prices)
print (crypto_prices_text)

client.api.account.messages.create(
to = to_number, 
from_ = from_number,
body=crypto_prices_text) #input text message
```

## Running the script locally

Now we can run this script locally, but first we need to assign the environment variables. For the twilio `account_sid` and `auth_token`, sign-in into your Twilio account, go to this [link](https://twilio.com/user/account). Now let's assign the values in our terminal. On mac it is as simple as running the `export` command in terminal:

```
export account_sid=XXXXXXXXXXXXXXXXXXXX
export auth_token=YYYYYYYYYYYYYY
export to_number=+1123456789
export from_number=+1123456789
```

### Installing dependencies and running the script

Let's install some dependencies:

- pip install twilio
- pip install pycoingecko

Now, if we run the script, we should receive a text message with crypto prices.

``` python
python main.py
```

## Let's automate the script to run everyday

So instead of running the script locally everyday, let's commit our Python code to [GitHub](https://github.com) and utilize [GitHub Actions](https://github.com/features/actions).
If you don't know what GitHub Actions are, they make it easy to automate all our software workflows, we can build, test, and deploy our code right from GitHub. Here is a [quick start guide](https://docs.github.com/en/actions/quickstart) about them.

After we have committed our code the new repository on GitHub or you can copy and paste it to the new repository, we will create a GitHub Action workflow.

- Create a .github/workflows directory in your repository on GitHub.
- In the .github/workflows directory, create a file named 'crypto-alerts.yml'.
- Copy the following YAML contents into the 'crypto-alerts.yml' file

``` yaml
name: run py script  

on: [workflow_dispatch]
  schedule:
    - cron: "0 0 * * *" #runs at 00:00 UTC everyday
    
jobs:
      build:
        runs-on: ubuntu-latest
    
        steps:
          - name: checkout repo content
            uses: actions/checkout@v2 # checkout the repository content to github runner.
          - name: setup python
            uses: actions/setup-python@v2
            with:
              python-version: 3.8 
          - name: execute py script
            run: |
              pip install twilio
              pip install pycoingecko
              python main.py
            env:
              account_sid: ${{ secrets.account_sid }}
              auth_token: ${{ secrets.auth_token }}
              to_number: ${{ secrets.to_number }}
              from_number: ${{ secrets.from_number }}
```

Let's understand this yaml file.

``` yaml
name: run py script  

on: [workflow_dispatch]
  schedule:
    - cron: "0 0 * * *" #runs at 00:00 UTC everyday
    
jobs:
      build:
        runs-on: ubuntu-latest
```

In this part, we name the workflow as 'run py script' and then have a schedule for it to run everyday at 00:00 UTC.

``` yaml
steps:
          - name: checkout repo content
            uses: actions/checkout@v2 # checkout the repository content to github runner.
          - name: setup python
            uses: actions/setup-python@v2
            with:
              python-version: 3.8 
          - name: execute py script
            run: |
              pip install twilio
              pip install pycoingecko
              python main.py
            env:
              account_sid: ${{ secrets.account_sid }}
              auth_token: ${{ secrets.auth_token }}
              to_number: ${{ secrets.to_number }}
              from_number: ${{ secrets.from_number }}
```

In this part of the yaml file, we define the environment for script to run and also install the dependencies 'twilio' and 'pycoingecko'. We also declare the environment variables to be used by the 'main.py' file. You might be asking where are we storing these environment variable values, well we will be utilizing 'Secrets' here:

- Under your repository name, click on the "Settings" tab.
- In the left sidebar, click `Secrets` and then `Actions`.
- On the right bar, click on `Add a new secret`.

![Screen Shot 2022-08-20 at 7.49.36 PM.png](<https://cdn.hashnode.com/res/hashnode/image/upload/v1661039387459/KkKyD-tbG.png> align="left")

After storing the environment variable values, let's run our GitHub Action to see if it works.
You can run the GitHub Action, but going to the repo, click the Actions tab and then under workflows, you will `Run Workflow` button on the right hand-side.

![Screen Shot 2022-08-20 at 7.58.31 PM.png](<https://cdn.hashnode.com/res/hashnode/image/upload/v1661039922327/WBwTHOJKD.png> align="left")

As you will see, the action runs and you can see the logs.
![Screen Shot 2022-08-20 at 7.56.31 PM.png](<https://cdn.hashnode.com/res/hashnode/image/upload/v1661039832637/Wllz-hyHz.png> align="left")

We should receive a text message from our Twilio number, with crypto prices.

![CryptoAlerts.gif](<https://cdn.hashnode.com/res/hashnode/image/upload/v1661179902726/zyqLecm1Z.gif> align="left")
