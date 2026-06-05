---
title: "How to add a logo or GIF to Windows Terminal App"
date: "2021-01-24T19:15:25.279Z"
lastmod: "2021-01-28T10:44:34.049Z"
description: "Hello amazing people 👋\nHope you all are doing great. I am here with my first blog post of 2021 and it started with an astounding recommendation that I made to one of the fellow clouders @jonnychipz. I remember I added that Azure Functions GIF to my ..."
slug: "how-to-add-a-logo-or-gif-to-windows-terminal-app"
url: "/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/"
draft: false
tags:
  - "Windows"
  - "terminal"
  - "Tutorial"
  - "dailydev"
  - "2Articles1Week"
cover:
  image: "/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/TVQ1ZdrVD-334738c232.png"
  alt: "How to add a logo or GIF to Windows Terminal App"
hashnode:
  id: "600dc74d3fdbb7412625ff33"
  url: "https://blog.rishabkumar.com/how-to-add-a-logo-or-gif-to-windows-terminal-app"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

Hello amazing people 👋

Hope you all are doing great. I am here with my first blog post of 2021 and it started with an astounding recommendation that I made to one of the fellow clouders [@jonnychipz](https://twitter.com/jonnychipz). I remember I added that Azure Functions GIF to my Terminal immediately as [Marc](https://twitter.com/marcduiker) was demonstrating it on one of the live streams.

[https://twitter.com/rishabk7/status/1351910466113585152?s=20](https://twitter.com/rishabk7/status/1351910466113585152?s=20)
So I thought, why not compose an article to show how to do it! I will begin with what Windows Terminal App is.

## Windows Terminal App:

So what is Windows Terminal App, in Microsoft's own words " Windows Terminal is a new, modern, fast, efficient, powerful, and productive terminal application for users of command-line tools and shells like Command Prompt, PowerShell, and WSL."
Here are some key features:
- Multiple tabs
- Beautiful text
- Settings and configurability
- Last but not the least, it's open source 💜

Feel free to check it out on GitHub:

[https://github.com/Microsoft/Terminal](https://github.com/Microsoft/Terminal)
## Customization:

Let's dive into customizing the black & white terminal and bring some personal touch to it.

Now to add a logo or a gif to your terminal, navigate to the Settings:

![image.png](/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/pSQiQiER0-e9ece3682e.png)

The settings should open up as a JSON file:

![image.png](/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/uOJaZSTRq-30b54197b7.png)

Now to add a logo or GIF, add the `backgroundImage` to your 'defaults' property, this way it will appear on all of the terminals (CMD, PowerShell, WSL etc.)
``` "backgroundImage":"https://rishabincloud.s3.amazonaws.com/nobg.png" ```
![image.png](/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/c0VcsBRjm-35f72930ab.png)

![image.png](/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/AXfPNxLx9-f4703a8116.png)

But hey, this doesn't look neat, it just appears as a background! So now we will add few more properties for the backgroundImage:

```
"backgroundImageAlignment" : "bottomRight",
"backgroundImageOpacity":1,
"backgroundImageStretchMode": "none"
```
So here is how your settings file should look like:

![image.png](/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/fai7bjn3W-0cbc00b80d.png)

And now if we look at the terminal:

![image.png](/images/blog/how-to-add-a-logo-or-gif-to-windows-terminal-app/0GC33XMP1-5a25e50927.png)

Looks pretty eh!

## Bonus:
Here is the link so you can add the Azure Functions Mascot to your terminal:

`backgroundImage":"https://raw.githubusercontent.com/marcduiker/azure-functions-university/main/img/zappy-university-192.gif`


Thanks to [Marc](https://twitter.com/marcduiker).


Also, you can customize the color scheme, I have been using [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for a while now, here is the Ubuntu theme that I am using with it 😉

```{
            // Color Scheme: UbuntuLegit
            "background":  "#2C001E",
            "black":  "#4E9A06",
            "blue":  "#3465A4",
            "brightBlack":  "#555753",
            "brightBlue":  "#729FCF",
            "brightCyan":  "#34E2E2",
            "brightGreen":  "#8AE234",
            "brightPurple":  "#AD7FA8",
            "brightRed":  "#EF2929",
            "brightWhite":  "#EEEEEE",
            "brightYellow":  "#FCE94F",
            "cyan":  "#06989A",
            "foreground":  "#EEEEEE",
            "green":  "#300A24",
            "name":  "UbuntuLegit",
            "purple":  "#75507B",
            "red":  "#CC0000",
            "white":  "#D3D7CF",
            "yellow":  "#C4A000"
     }
```

See you in the next blog and you can follow me on Twitter [@rishabk7](https://twitter.com/rishabk7).
