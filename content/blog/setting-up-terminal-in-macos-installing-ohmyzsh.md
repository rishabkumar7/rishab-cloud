---
title: "Setting up terminal in macOS, installing ohmyzsh"
date: "2022-05-26T03:32:02.112Z"
description: "I know you haven't heard from me for a while, but I just have been really busy with some career changes, will definitely right about them.\nSo I finally received my new work laptop and it's a new m1 MacBook pro.\nWhich means I need to set it up, especi..."
slug: "setting-up-terminal-in-macos-installing-ohmyzsh"
url: "/blog/setting-up-terminal-in-macos-installing-ohmyzsh/"
draft: false
tags:
  - "macOS"
  - "terminal"
  - "command line"
  - "Computer Science"
  - "General Programming"
cover:
  image: "/images/blog/setting-up-terminal-in-macos-installing-ohmyzsh/JMaZcFHIS-5221563eed.png"
  alt: "Setting up terminal in macOS, installing ohmyzsh"
hashnode:
  id: "628ef4b219bda58ac7fb2036"
  url: "https://blog.rishabkumar.com/setting-up-terminal-in-macos-installing-ohmyzsh"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

I know you haven't heard from me for a while, but I just have been really busy with some career changes, will definitely right about them.

So I finally received my new work laptop and it's a new m1 MacBook pro.
Which means I need to set it up, especially the terminal.

As some of you already know, I like to see my terminal with colours and icons that help me to see what I am doing.

We need few things, and here are the steps we are going to to take:

1. Install iTerm
2. Install homebrew
3. Install zsh & oh-my-zsh
4. Install Powerline fonts


## Install iTerm
This step is optional, I just prefer it over the regular `terminal` app that comes pre-installed.
You can install the iTerm2 app from the official site - https://iterm2.com/

## Install homebrew
What is homebrew, you might ask? It's a package manager for macOS.
You can use the below command to install homebrew
``` 
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" ```

## Install zsh & oh-my-zsh
Next we will be installing zsh shell. You don't need to install it, since [macOS already comes with zsh shell](https://www.theverge.com/2019/6/4/18651872/apple-macos-catalina-zsh-bash-shell-replacement-features).
So now we just need oh-my-zsh, we can install it via curl:
``` 
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" ```

## Install Powerline fonts
We need some cool fonts, even though iTerm2 has support for Powerline glyphs, we need powerline fonts for support in other apps, like VSCode or the default terminal.

Clone powerline fonts repo:
`git clone https://github.com/powerline/fonts.git --depth=1`

Install fonts:
``` 
cd fonts
./install.sh ```

Recycle the stuff you don’t need anymore:
```
cd ..
rm -rf fonts ```

Now we just need to set a theme and change our font, I personally use "UbuntuMono" font and "agnoster" theme. You can choose from a selection of [different themes.](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)

Font can be changed within the iTerm app preferences, but for the zsh theme, you will need to:

Use your preferred editor to edit the .zshrc file:
```
nano ~/.zshrc ```

Set the ZSH theme to the agnoster:
```
ZSH_THEME=”agnoster” ```

Quit your editor, as I used nano:
- CTRL + O will save modifications
- CTRL + X will exit nano

And voila! you have a terminal looking like this:
![image.png](/images/blog/setting-up-terminal-in-macos-installing-ohmyzsh/Bo4YiWAc0-9bf8337c5e.png)
