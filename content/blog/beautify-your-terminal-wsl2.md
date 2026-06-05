---
title: "Beautify your Terminal - WSL2"
date: "2020-08-08T13:46:36.507Z"
lastmod: "2023-05-26T02:22:49.620Z"
description: "I used Ubuntu as a VM for front-end development. But recently I have been testing Windows Subsystem of Linux (WSL 2) and so far it's good. No need to run VM anymore! (Since I only care about the command line functionality). Also, I have been trying o..."
slug: "beautify-your-terminal-wsl2"
url: "/blog/beautify-your-terminal-wsl2/"
draft: false
tags:
  - "WSL"
  - "cli"
  - "Linux"
  - "General Programming"
  - "2Articles1Week"
cover:
  image: "/images/blog/beautify-your-terminal-wsl2/493b297d-e7e7-4a04-adb2-1ff800020b39-c6fceb4a6b.png"
  alt: "Beautify your Terminal - WSL2"
hashnode:
  id: "5f2eacd33b12e25afe3e4ee0"
  url: "https://blog.rishabkumar.com/beautify-your-terminal-wsl2"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

I used Ubuntu as a VM for front-end development. But recently I have been testing [Windows Subsystem of Linux (WSL 2)](https://devblogs.microsoft.com/commandline/wsl-2-is-now-available-in-windows-insiders/) and so far it's good. No need to run VM anymore! (Since I only care about the command line functionality). Also, I have been trying out the [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) and I gotta say that it is amazing!

Here is a guide on [how to get started with WSL](https://dev.to/pluralsight/getting-started-with-wsl-1abp) by @jeremycmorgan.

---

So my terminal looks like this right now:

![Alt Text](/images/blog/beautify-your-terminal-wsl2/724h6x5po0rgdjj1orqi-10b8e58c8b.png)

And here is the guide for the same. (Assuming that you have WSL enabled, Ubuntu and Windows Terminal App installed, if not, you can [follow this guide](https://dev.to/pluralsight/getting-started-with-wsl-1abp))

---

### Install oh-my-zsh:

Make sure zsh is installed:

```python
apt install zsh
```

Install ohmyzsh

```python
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

---

### Install and configure Powerline fonts

To install the Powerline fonts:

1. Open a Powershell session as administrator.
    
2. Download and expand the Powerline fonts repository:
    
    `powershell -command "& { iwr [<https://github.com/powerline/fonts/archive/master.zip>](<https://github.com/powerline/fonts/archive/master.zip>) -OutFile ~\\fonts.zip }" Expand-Archive -Path ~\\fonts.zip -DestinationPath ~`
    
3. Update the execution policy to allow the installation of the fonts:
    
    `Set-ExecutionPolicy Bypass`
    
4. Run the installation script:
    
    `~\\fonts-master\\install.ps1`
    
5. Revert the execution policy back the default value:
    
    `Set-ExecutionPolicy Default`
    

---

### Edit the settings for WSL:

To configure the fonts:

For Windows Terminal App:

* Open the Windows Terminal App.
    
* Go to settings.
    
    ![Alt Text](/images/blog/beautify-your-terminal-wsl2/6uimsg314p7hlewldasy-c94d9d564d.png)
    
* Update the json, list one of the Powerline fonts.
    
    ![Alt Text](/images/blog/beautify-your-terminal-wsl2/dh2hjdykwgdvxe7157kz-f7009b0d3e.png)
    

For Ubuntu App:

* Open the Ubuntu app.
    
* Open the **Properties** dialog.
    
* From the **Font** tab, select one of the Powerline fonts, such as *ProFont for Powerline*.
    
* Click **OK**.
    

---

### Choose your theme! 🎨

You can now choose the theme you want for your terminal, there are many to [choose from](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes). I am using "agnoster". You can do so by:

* Edit the '.zshrc' file `nano ~/.zshr`
    
* Change the theme to one that you selected:
    

![2020-08-08 09_45_51-Clipboard.png](/images/blog/beautify-your-terminal-wsl2/gtYCf1cvP-74fa27458a.png)

You can also enable different Plugins:

```python
plugins=(
  git
  bundler
  dotenv
  osx
  rake
  rbenv
  ruby
)
```

Let me know which theme you picked! Also, feel free to reach out if you have any concerns.
