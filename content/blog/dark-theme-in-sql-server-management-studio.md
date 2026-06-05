---
title: "Dark theme in SQL Server Management Studio"
date: "2020-08-08T21:30:10.497Z"
description: "Dark theme and me!🖤\nI just love having dark theme for every tool and application I use on day to day basis, ranging from: VSCode, Notepad++ and Notion to Slack, Teams and Outlook.\nAfter switching between a lot of dark themes in VSCode, I finally set..."
slug: "dark-theme-in-sql-server-management-studio"
url: "/blog/dark-theme-in-sql-server-management-studio/"
draft: false
tags:
  - "SQL"
  - "General Programming"
  - "SQL Server"
  - "2Articles1Week"
cover:
  image: "/images/blog/dark-theme-in-sql-server-management-studio/hgS0-tV1n-3b84af18af.webp"
  alt: "Dark theme in SQL Server Management Studio"
hashnode:
  id: "5f2f1a1cb8ac395b1f23aa76"
  url: "https://blog.rishabkumar.com/dark-theme-in-sql-server-management-studio"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

## Dark theme and me!🖤

I just love having dark theme for every tool and application I use on day to day basis, ranging from: VSCode, Notepad++ and Notion to Slack, Teams and Outlook.
After switching between a lot of dark themes in VSCode, I finally settled for Dracula due to the number of applications it supports. So now I can have single dark theme across all the applications that I use.
- [VSCode](https://draculatheme.com/visual-studio-code/)
- [Slack](https://draculatheme.com/slack/)
- [Notepad++](https://draculatheme.com/notepad-plus-plus/)
- [Terminal](https://draculatheme.com/terminal/)

Make sure to check them out.(I know most of us are already using them).

So now that you know about my love for dark themes, I was frustrated that you don't have one for SQL Server Management Studio (SSMS).
I was only aware of the "Blue" and "Light" theme that you can toggle between by going to: Tools > Options > Environment > General > Color theme:
![Alt Text](/images/blog/dark-theme-in-sql-server-management-studio/brk4kxgkoumixkx1yqc5-fa42cff27d.png)


But I found out through my colleague that you can set it up, and here are the steps on how you can do it:
(Disclaimer: It's not officially supported)

### Step 1:
Locate and update the config file.
Open any text editor as Administrator, in my case its Notepad++ (as if I have not mentioned it enough 😊). Now we will locate the 'ssms.pkgundef' file.
- For SSMS 17 its: C:\Program Files (x86)\Microsoft SQL Server\140\Tools\Binn\ManagementStudio
- For SSMS 18: C:\Program Files (x86)\Microsoft SQL Server Management Studio 18\Common7\IDE

And open it.

### Step 2:
Disable "Remove Dark Theme"
So now you have the file open, scroll down and find the section of the code under the “Remove Dark theme” heading, add “//” to comment out that line, and save the file:

![Alt Text](/images/blog/dark-theme-in-sql-server-management-studio/kjo5wp5hh0s2vogaq2jy-1e888e2bc7.png)

### Step 3:
It's time to see the magic!🖤
Start SSMS and the 'Dark' will be available in the Color theme drop-down menu:

![Alt Text](/images/blog/dark-theme-in-sql-server-management-studio/5tf3f8gcab6wvfb86zxa-e20a99c821.png)

Hope you like this article, follow me for my upcoming articles like such!
You can also find me on [Twitter](https://twitter.com/rishabk7)
