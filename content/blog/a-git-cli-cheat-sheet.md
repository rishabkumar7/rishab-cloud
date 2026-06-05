---
title: "A Git CLI cheat-sheet"
date: "2021-02-24T18:59:17.395Z"
lastmod: "2023-03-03T14:32:52.276Z"
description: "Hello, amazing people 👋\nI am finally back in 🍁and after a 20 hour flight, I needed some time to relax and get back to my EST time zone schedule.\nThis week I had some fun with cleaning up my Github, while I was doing that I realized why not create a..."
slug: "a-git-cli-cheat-sheet"
url: "/blog/a-git-cli-cheat-sheet/"
draft: false
tags:
  - "Git"
  - "GitHub"
  - "cheatsheet"
  - "Developer"
  - "General Programming"
cover:
  image: "/images/blog/a-git-cli-cheat-sheet/72f64242-e657-4420-950d-a88c82615986-7ba1a8a412.png"
  alt: "A Git CLI cheat-sheet"
hashnode:
  id: "6036a91a0c99f77f2f8a62af"
  url: "https://blog.rishabkumar.com/a-git-cli-cheat-sheet"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello, amazing people 👋

I am finally back in 🍁and after a 20 hour flight, I needed some time to relax and get back to my EST time zone schedule.

This week I had some fun with cleaning up my [Github](https://github.com/rishabkumar7), while I was doing that I realized why not create a Git CLI cheat sheet to help other.

![image.png](/images/blog/a-git-cli-cheat-sheet/bBT1uNsSq-025fc07d50.png)

Now, let me get started with Git.

## What is Git?

Git is a free, open-source version control software. It was made by Linus Torvalds in 2005. This tool is a version control system that was at first evolved to work with a few engineers on the Linux Kernel.

This basically means that Git is a content tracker. So Git can be used to store content — and it is mostly used to store code because of the other features it provides.

Real life projects generally have multiple developers working in parallel. So they need a version control system like Git to ensure that there are no code clashes between them.

The branch system in Git permits developers to work independently on an undertaking (For instance: One branch - &gt; One errand OR One branch - &gt; One developer). Fundamentally consider Git a little programming application that controls your code base, in case you're a developer.

So to begin utilizing Git, we need to realize where to have our repositories.

A repository (or "Repo" for short) is a task that contains numerous documents. For our situation a repository will contain code-based records.

There are two different ways you can have your repositories. One is on the web (on the cloud) and the second is not on web (self-hosted).

There are three well known hosting services: GitHub, GitLab and BitBucket.

I would like to share this amazing [article](https://www.freecodecamp.org/news/the-beginners-guide-to-git-github/) 'The Beginners Guide to Git' by Thanoshan MV.

Now let's get to the the cli commands.

## Some Git CLI commands

*Git : Configure*

* `git config --global user.email "youremail@example.com "` sets email address respectively to be used with your commits.
    
* `git config --global user.name "FirstName LastName"` sets the author name.
    
* `git config --list` command to list all the settings Git can find at that point.
    
* `git config --global color.ui true` Git automatically colors of its output.
    

*Git : commit to repository*

* `git commit -m "Add three files"` command records or snapshots the file permanently in the version history.
    
* `git commit --amend -m <enter your message>` command allows you to change the commit message.
    

*Git : branching*

* `git branch` command lists all the local branches in the current repository.
    
* `git branch <branch-name>` command creates a new branch.
    
* `git checkout <branch-name>` command is used to switch from one branch to another.
    
* `git merge <branch-name>` command merges the specified branch’s history into the current branch.
    
* `git checkout -b <branch-name>` command creates a new branch and also switches to it.
    

*Git : Initiating a repository*

* `git init` command is used to start a new repository.
    
* `git status` command lists all the files that have to be committed.
    

*Git : Pulling & pushing from and to repositories*

* `git remote add origin <link-to-repo>` ommand is used to connect your local repository to the remote server.
    
* `git push -u origin main` command sends the committed changes of main branch to your remote repository.
    
* `git clone <link-to-clone-repo>` command is used to obtain a repository from an existing URL.
    
* `git pull` command fetches and merges changes on the remote server to your working directory.
    

*Git : Staging*

* `git add <file-name>` command adds a file to the staging area.
    
* `git add <file-name> <second-file-name> <third-file-name>` command adds one or more files to the staging area.
    
* `git add .` command adds all files under the current directory to the staging area.
    
* `git add --all` command finds all new and updated files everywhere throughout the project and add them to the staging area.
    
* `git add -A` Same as `--all`
    
* `git rm --cached <file-name>`
    
* `git reset <file-name>` command unstages the file, but it preserves the file contents
    

The PDF version of the same is available [here](https://www.buymeacoffee.com/rishabincloud/e/121186).

Hope this is helpful, and if you have any concerns or feedback feel free to reach out on [Twitter](https://twitter.com/rishabk7), my dms are open 🙂.
