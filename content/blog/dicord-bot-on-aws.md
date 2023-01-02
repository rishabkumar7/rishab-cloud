---
title: Host your Discord Bot on EC2 instance(AWS)
type: page
description: Click on me to see the content.
topic: cloud
---

Hey Everyone,

Today I will be sharing on how to host your Discord Bot on AWS (EC2 Instance).
Assuming that you already have a discord bot created (if not, please checkout this amazing article :[Creating your first Discord Bot — Part 1](https://medium.com/davao-js/2019-tutorial-creating-your-first-simple-discord-bot-47fc836a170b)

Let's dive into it.

## Creating a server instance.

- Go to the Amazon EC2 Page and sign up for an account.
- Navigate to the Amazon web services console.
- Click on “EC2” (top left of page).
- Select "Launch Instance".
- Select "Ubuntu Server 18.04 LTS (HVM), SSD Volume Type - ami-07ebfd5b3428b6f4d"
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/5lxqot51tnr4rd3whiry.png)
- Pick “General Purpose” (free tier micro)
- Select “Review and Launch”
- Launch!
- You’ll then see a prompt about your “key/pair”. The key pair consists of a public key that AWS stores, and a private key file that you store. They come together in a file “something.pem” which you will need in order to login to your account. Select “create new pair” and enter a title for your key/pair.
- Select “Download Key Pair”. The file will download to your computer. Save this file! You’ll need it for future steps.
- Now click “Launch Instances”.
- Now you should see a message that “Your instances are launching” (it may take a few minutes before they are available.)
- Select “View Instances”.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/8k7hjrfpjzvwg6ezo2te.png)

## Connect to your instance

- Navigate terminal to the directory where you have your “pem” file. First you must make sure your key is not “publicly” viewable. This has to do with file permissions.

> chmod 400 yourkeyfile.pem

- Login using the key with the following command:

> $ ssh -i "yourkeyfile.pem" ubuntu@54.38.245.127

- ⚠️Replace “54.38.245.127” with your “public IP” as shown in your EC2 console.
- Your terminal should then show that you have connected.😊

## Installing node and running your Bot.

- Install node

> sudo apt-get update
> sudo apt-get install nodejs
> sudo apt-get install npm

- Upload your node application to the server. You can do this with SFTP software like Cyberduck or WinSCP. The key is selecting “Use Public Key Authentication” rather than enter a password. OR you can clone your repo from Git.
- Install the node package dependencies (specified in your package.json file):

> npm install

- Once your files are uploaded you’ll want to check and make sure your bot works, i.e.

> node bot.js

- The bot will only run while you have terminal open. In order for it to run after you’ve logged out of your EC2 instance and closed your computer, you can either use PM2 or "forever".

## Install PM2.

- PM2 provides an easy way to manage and daemonize applications (run them in the background as a service).
- We will use npm, a package manager for Node modules that installs with Node.js, to install PM2 on our server. Use this command to install PM2

> sudo npm install -g pm2

Now, we will use the pm2 start command to run our bot, bot.js, in the background

> pm2 start bot.js
> [PM2] Starting /home/ubuntu/discord-greeter-bot/bot.js in fork_mode(1 instance)
> [PM2] Done.
> ┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
> │ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   > │
> ├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
> │ 0  │ bot                │ fork     │ 0    │ online    │ 0%       │ 40.4mb   │
> │ 1  │ bot                │ fork     │ 0    │ online    │ 0%       │ 24.5mb   │
> └────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

⚠️Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but an additional step needs to be taken to get the application to launch on system startup (boot or reboot). Luckily, PM2 provides an easy way to do this, the startup subcommand.

The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots:
> pm2 startup systemd

The last line of the resulting output will include a command that you must run with superuser privileges:
> Output
> [PM2] Init System found: systemd
> [PM2] You have to run this command as root. Execute the following command:
> sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -> -u ubuntu --hp /home/ubuntu

Run the command that was generated (similar to the highlighted output above, but with your username instead of ubuntu) to set PM2 up to start on boot (use the command from your own output):
> sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -> u ubuntu --hp /home/ubuntu
