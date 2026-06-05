---
title: "How to set up your own VPN Client in 15 minutes"
date: "2020-07-21T01:16:47.000Z"
lastmod: "2023-05-26T02:24:49.040Z"
description: "I recently set up a VPN client for personal use by using a VM and OpenVPN.\nWhat you'll need:\n\nA Linux VM in the Cloud ☁\nOpenVPN Client\n\nFor this article, I will be using a VM in Azure.\nGetting your Linux VM ready!\n\nLaunch a VM Ubuntu 18.04 in Azure.\n..."
slug: "how-to-set-up-your-own-vpn-client"
url: "/blog/how-to-set-up-your-own-vpn-client/"
draft: false
tags:
  - "Linux"
  - "vpn"
cover:
  image: "/images/blog/how-to-set-up-your-own-vpn-client/YBEjrJANj-f8df1e496c.webp"
  alt: "How to set up your own VPN Client in 15 minutes"
hashnode:
  id: "5f2614f0669da9610ee181b3"
  url: "https://blog.rishabkumar.com/how-to-set-up-your-own-vpn-client"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

I recently set up a VPN client for personal use by using a VM and OpenVPN.

## What you'll need:
- A Linux VM in the Cloud ☁
- OpenVPN Client

For this article, I will be using a VM in Azure.

## Getting your Linux VM ready!

- Launch a VM Ubuntu 18.04 in Azure.

- Make sure you have open the following ports for inbound connection. During the creation process, we can only unlock the following ports: Port 80 (HTTP), 443 (HTTPS), 3389(RDP) and 22 (SSH). In addition to the already unlocked ports, we need to unlock the following ports: TCP on port 943 and UDP on port 1194. We can do this in the network settings of our VM.

![Alt Text](/images/blog/how-to-set-up-your-own-vpn-client/d0oqur9ppk818i6frlwa-d1a9489641.png)

- Similarly, open the UDP port 1194.

- Now SSH into your VM and let's get started with the install.

- Run the following commands:
```bash
sudo apt update
sudo apt upgrade
```
- Get the public IP address if not sure!
```bash
dig +short myip.opendns.com @resolver1.opendns.com
```
- Download and run the [opnevpn.sh](http://opnevpn.sh) script
```bash
wget https://git.io/vpn -O openvpn-install.sh
```
- Add the execution bit
```bash
chmod +x openvpn-install.sh
```
- Run the script
```bash
sudo ./openvpn-install.sh
```

![Alt Text](/images/blog/how-to-set-up-your-own-vpn-client/wugmlckln176qt7ofns6-b889d91b3d.png)

After the install is complete, you should see a Finished message if it was successful.

## Creating profiles:
Now you can run the script again to create different profiles.

There was one created during the install and it should be located in the home directory of your VM.

You can use WinSCP to copy the file to the local machine.

## Installing the client on the local machine:
- Now you need the OpenVPN client on your local machine and import settings from the .ovpn file that was copied in the previous step.

- After installing the client, you should be able to import the .ovpn file into the OpenVPN client

![Alt Text](/images/blog/how-to-set-up-your-own-vpn-client/ugodhipo8t40a1sv4z3d-dbb629dd47.png)

- After the profile is imported, you should be able to connect to your personal VPN server.

![Alt Text](/images/blog/how-to-set-up-your-own-vpn-client/gwwgxyq69z09j3rv85uk-c1be523162.png)

![Alt Text](/images/blog/how-to-set-up-your-own-vpn-client/eljwm5ajgehqsqtrt38y-a9bdf471b1.png)

Please feel free to reach out if there are any hiccups setting this up.
Also, you can follow me on [Twitter!](https://twitter.com/rishabk7)
