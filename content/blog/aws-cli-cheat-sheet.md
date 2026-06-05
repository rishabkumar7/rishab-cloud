---
title: "AWS CLI Cheat Sheet: Quick Reference Guide for Cloud Developers"
date: "2023-03-10T19:55:34.561Z"
lastmod: "2023-03-10T20:37:42.280Z"
description: "With cloud computing becoming more popular and AWS being one of the leading cloud providers, it's essential for developers to understand how to use the AWS Command Line Interface (CLI).\nThe command line interface (CLI) is a powerful tool that allows ..."
slug: "aws-cli-cheat-sheet"
url: "/blog/aws-cli-cheat-sheet/"
draft: false
tags:
  - "AWS"
  - "cli"
  - "command line"
  - "Cloud"
  - "Cloud Computing"
cover:
  image: "/images/blog/aws-cli-cheat-sheet/f02c0cf7-7561-4692-a762-da18107a6599-9e63a55cc6.jpeg"
  alt: "AWS CLI Cheat Sheet: Quick Reference Guide for Cloud Developers"
hashnode:
  id: "640b8b3634e0793f6356240a"
  url: "https://blog.rishabkumar.com/aws-cli-cheat-sheet"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

With cloud computing becoming more popular and AWS being one of the leading cloud providers, it's essential for developers to understand how to use the AWS Command Line Interface (CLI).

The command line interface (CLI) is a powerful tool that allows developers to manage AWS resources and services from the command line, and it can greatly improve your workflow. However, with so many commands and options available, getting started can be overwhelming for beginners. This is where my AWS CLI Cheat Sheet comes into play. It provides you with a concise yet comprehensive reference guide covering the most commonly used AWS CLI commands for services like EC2, IAM and S3 in this blog. Whether you're new to AWS or an experienced developer looking to improve your workflow, this cheat sheet will help.

## Installation

First, you will need to install the AWS CLI on your machine. You can find the instructions on how to install the latest version of AWS CLI:

### Linux:

x86

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Linux Arm

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### MacOS:

```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

### Windows:

Download and run the AWS CLI MSI installer for Windows (64-bit)

[https://awscli.amazonaws.com/AWSCLIV2.msi](https://awscli.amazonaws.com/AWSCLIV2.msi)

Alternatively, you can run the `msiexec` command to run the MSI installer.

```powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

Now that we have the AWS CLI installed, let's cover the important command to configure it with our AWS Account.

## Configuring AWS CLI

In order to authenticate to our AWS account, you will need to generate an Access key and secret access key for an IAM user.

You can refer to the documentation from AWS on how to create Access keys for IAM users - [Create an AWS access key (](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/)[amazon.com](http://amazon.com)[)](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/).

The AWS CLI stores our information in a *profile* named `default` in the `credentials` file. By default, the information in this profile is used when you run an AWS CLI command that doesn't explicitly specify a profile to use.

The following example shows how you can configure the AWS CLI. Replace them with your own values:

```bash
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: ca-central-1
Default output format [None]: json
```

We have the AWS CLI configured now to work with out AWS account. Let's go over the commands now to interact with AWS EC2, IAM and S3 services.

## AWS EC2

### Keypairs

list all keypairs:

`aws ec2 describe-key-pairs`

create a keypair:

`aws ec2 create-key-pair --key-name --output text`

create a new local private/public keypair, using RSA 4096-bit:

`ssh-keygen -t rsa -b 4096`

import an existing keypair:

`aws ec2 import-key-pair --key-name keyname_test --public-key-material file:///home/rkumar/id_rsa.pub`

delete a keypair:

`aws ec2 delete-key-pair --key-name`

### Images

list all private AMI's, ImageId and Name tags:

```bash
aws ec2 describe-images --filter "Name=is-public,Values=false" --query 'Images[].[ImageId, Name]' --output text
```

delete an AMI, by ImageId:

`aws ec2 deregister-image --image-id ami-00000000`

### Instances

list all instances (running, and not running):

`aws ec2 describe-instances`

list all instances running:

`aws ec2 describe-instances --filters Name=instance-state-name,Values=running`

create a new instance:

```bash
aws ec2 run-instances --image-id ami-a0b1234 --instance-type t2.micro --security-group-ids sg-00000000 --dry-run
```

stop an instance:

`aws ec2 terminate-instances --instance-ids <instance_id>`

list status of all instances:

`aws ec2 describe-instance-status`

list status of a specific instance:

`aws ec2 describe-instance-status --instance-ids <instance_id>`

list all running instance, Name tag and Public IP Address:

```bash
aws ec2 describe-instances --filters Name=instance-state-name,Values=running --query 'Reservations[].Instances[].[PublicIpAddress, Tags[?Key==Name].Value | [0] ]' --output text
```

### Security Groups

list all security groups:

`aws ec2 describe-security-groups`

create a security group:

`aws ec2 create-security-group --vpc-id vpc-1a2b3c4d --group-name web-access --description "web access"`

list details about a securty group:

`aws ec2 describe-security-groups --group-id sg-0000000`

open port 80, for everyone:

`aws ec2 authorize-security-group-ingress --group-id sg-0000000 --protocol tcp --port 80 --cidr 0.0.0.0/24`

get my public ip:

`my_ipaddress=$(dig +short` [`myip.opendns.com`](http://myip.opendns.com) `@`[`resolver1.opendns.com`](http://resolver1.opendns.com)`); echo $my_ipaddress`

open port 22, just for my ip:

`aws ec2 authorize-security-group-ingress --group-id sg-0000000 --protocol tcp --port 80 --cidr $my_ipaddress/24`

remove a firewall rule from a group:

`aws ec2 revoke-security-group-ingress --group-id sg-0000000 --protocol tcp --port 80 --cidr 0.0.0.0/24`

delete a security group:

`aws ec2 delete-security-group --group-id sg-00000000`

---

## AWS IAM

### Users

list all user's info:

`aws iam list-users`

list all user's usernames:

`aws iam list-users --output text | cut -f 6`

list current user's info:

`aws iam get-user`

list current user's access keys:

`aws iam list-access-keys`

crate new user:

```bash
aws iam create-user --user-name UserName
```

create multiple new users, from a file:

```bash
allUsers=$(cat ./user-names.txt) for userName in $allUsers; do aws iam create-user --user-name $userName done
```

list all users:

`aws iam list-users --no-paginate`

get a specific user's info:

`aws iam get-user --user-name UserName`

delete one user:

`aws iam delete-user --user-name UserName`

delete all users:

```bash
allUsers=$(aws iam list-users --output text | cut -f 6);
allUsers=$(cat ./user-names.txt) for userName in $allUsers; do aws iam delete-user 
--user-name $userName done
```

### Access Keys

list all access keys:

`aws iam list-access-keys`

list access keys of a specific user:

`aws iam list-access-keys --user-name UserName`

create a new access key:

`aws iam create-access-key --user-name UserName --output text | tee UserName.txt`

list last access time of an access key:

`aws iam get-access-key-last-used --access-key-id AKSZZRR7RKZY4EXAMPLE`

deactivate an access key:

`aws iam update-access-key --access-key-id AKIZNAA7RKZY4EXAMPLE --status Inactive --user-name UserName`

delete an access key:

`aws iam delete-access-key --access-key-id AKIZNAA7RKZY4EXAMPLE --user-name UserName`

### Group and Policies

list all groups:

`aws iam list-groups`

create a group:

`aws iam create-group --group-name GroupName`

delete a group:

`aws iam delete-group --group-name GroupName`

list all policies:

`aws iam list-policies`

get a specific policy:

`aws iam get-policy --policy-arn`

list all users, groups, and roles, for a given policy:

`aws iam list-entities-for-policy --policy-arn`

list policies, for a given group:

`aws iam list-attached-group-policies --group-name GroupName`

add a policy to a group:

```bash
aws iam attach-group-policy --group-name GroupName --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

add a user to a group:

`aws iam add-user-to-group --group-name GroupName --user-name UserName`

list users, for a given group:

`aws iam get-group --group-name GroupName`

list groups, for a given user:

`aws iam list-groups-for-user --user-name UserName`

remove a user from a group:

`aws iam remove-user-from-group --group-name GroupName --user-name UserName`

remove a policy from a group:

`aws iam detach-group-policy --group-name GroupName --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`

delete a group:

`aws iam delete-group --group-name GroupName`

---

## AWS S3

list buckets:

`aws s3 ls`

list bucket content:

`aws s3 ls s3://<bucketName>`

make bucket:

`aws s3 mb s3://<bucketName>`

remove empty bucket:

`aws s3 rb s3://<bucketName>`

copy to bucket:

`aws s3 cp <object> s3://<bucketName>`

copy from bucket:

`aws s3 cp s3://<bucketName>/<object> <destination>`

move object:

`aws s3 mv s3://<bucketName>/<object> <destination>`

sync objects:

`aws s3 sync <local> s3://<bucketName>`

removed objects:

`aws s3 rm s3://<bucketName>/<object>`

---

You can download the PDF verision of the AWS CLI cheat-sheets here:
- [AWS EC2](https://www.buymeacoffee.com/rishabincloud/e/122221)

Hope you liked this post, feel free to reach out to me on [Twitter](https://twitter.com/rishabk7) or [LinkedIn](https://linkedin.com/in/rishabkumar7).  
Happy Coding!
