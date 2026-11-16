---
title: "I Turned a Cheap Photo Frame Into a Family Dashboard"
date: "2026-11-15T10:00:00-06:00"
lastmod: "2026-11-15T10:00:00-06:00"
description: "How I unlocked an Allwinner A33 photo frame, got root without flashing anything, and made it boot straight into a dashboard running on Cloudflare Workers."
slug: "photo-frame-family-dashboard"
url: "/blog/photo-frame-family-dashboard/"
draft: true
tags:
  - "android"
  - "cloudflare"
  - "diy"
  - "ai"
# TODO: add a photo of the frame on the wall and uncomment.
# cover:
#   image: "/images/blog/photo-frame-family-dashboard/frame-on-wall.jpg"
#   alt: "The family dashboard running on a 10.1 inch photo frame"
---

I watched Wes Bos's video on [hacking smart photo frames](https://wesbos.com/hacking-smart-photo-frames) and immediately ordered one.

The idea is simple. Those cheap 10.1" Android photo frames are basically a tablet with no battery, a decent screen, and Wi-Fi. If you can get past the vendor app, you can make them show whatever you want.

I wanted a family dashboard. Something on the wall that shows the time, the weather, what's on our calendars today, and some photos. And yes, my YouTube channel stats, because why not.

This is how that went, including the parts that did not go to plan.

Let's dive in!

## The frame was not the one in the video

The first lesson: the frame you order is not always the frame you get. Frames sold under the same Amazon listing ship with different boards.

Wes's frame was a Rockchip board. Mine showed this in **Settings → About**:

```txt
YHK.F-null-A33-1001-D1024-PF1007L-321-OS-AIMOR.0.20260113
```

That is a **PF1007L** with an **Allwinner A33** chip, Android 6.0.1 and 1 GB of RAM. It runs a vendor app called AiMOR.

The good news is that a lot of people got this exact board after the video. Wes's repo, [wesbos/photo-frame-dashboard](https://github.com/wesbos/photo-frame-dashboard), has a whole [start-here page for the PF1007L](https://github.com/wesbos/photo-frame-dashboard/blob/main/docs/pf1007l-start-here.md) built from more than 30 owners' reports. It has a test sequence, and each step has a pass condition. You stop at the first step that fails.

I really liked that structure. It turns "hack a photo frame" into a checklist.

## Read this before your frame touches Wi-Fi

This is the part I wish I had read first.

The AiMOR app on these frames connects to the vendor's server and [accepts root shell commands from it](https://github.com/wesbos/photo-frame-dashboard/blob/main/docs/aimor-remote-root-shell.md). So the moment the frame is on your Wi-Fi, someone else's server has root on a device in your home.

Mine was already on my Wi-Fi before I got to that page. When I checked, AiMOR had an open connection to the vendor server on port `7806`.

Not great. But it is also why the guide has a lock-down step, which we will get to.

If you are buying one of these, keep it off your network until you have done that step. If you can, put it on a guest or IoT network afterwards too.

## Getting root without flashing anything

The guide's order is: try ADB over USB first, then the "no extra tools" route, then the network, and only then a boot patch from an SD card.

The no-extra-tools route is wild. The frame has a hidden factory test app, and it has a switch that turns on ADB:

1. Go to **About** and tap **Model Number** until **Open test app** asks for a password.
2. Enter `YHK88888888`.
3. Tap **IS CLOSED** so it reads **is open**.

That's it. After that:

```bash
adb shell id
```

```txt
uid=0(root) gid=0(root)
```

Root ADB over USB. No SD card, no flashing, no boot patch. And it came back after every power-cycle.

At the time, the docs said this password was only confirmed on the May firmware. Mine was January, so that turned out to be a new data point (more on that at the end).

## The USB hub that turned my frame off

This one took me a minute.

My first cable and port showed nothing on USB at all. So I tried a USB hub. Through a bus-powered Realtek USB 2.1 hub, the screen went black, the frame showed up for a second as an Allwinner FEL device (`1f3a:efe8`, the chip's recovery mode), and then disappeared.

It was not a data problem. It was a power problem. The hub could not supply enough power and the frame browned out.

What worked: a USB-A to USB-C **data** cable, a USB-C to USB-A adapter, straight into a port on my Mac. No hub.

Two tips if you are trying this:

* On the PF1007L, **USB-C to USB-C cables do not work**. Use USB-A to USB-C.
* The cable in the box can be charge-only. Use one you know carries data.

## Backup first, always

Wes's repo has a rule I really like: no writes before a verified backup.

So before changing anything, I backed up the entire 15.7 GB eMMC over ADB. It was read in 59 chunks of 256 MiB with BusyBox `dd`. For each chunk, the SHA-256 on my Mac had to match a second read hashed on the frame itself.

All 59 matched on the first try. It took about 43 minutes.

That is a long time to stare at a progress log, but it means that if I break the frame, I can put it back exactly how it was.

## Locking it down

With a backup in place, the lock-down step:

* Install a different launcher first, so there is still a way into Android Settings.
* Disable AiMOR (`com.efercro.os.aimor`), its updater (`com.yhk.qeota`) and the factory test app (`com.DeviceTest`).
* Remove the saved Wi-Fi networks.

That last one had a surprise. Besides my own network, the frame had a saved network I never added, called `3F-WPA3`. Most likely a leftover from the factory. Another owner reported the same kind of thing, so check yours.

After a power-cycle, I checked again:

```bash
adb shell 'netstat -an | grep :7806'
```

No output. No more connection to the vendor server.

One more thing the guide repeats a few times: **prove the way back before you close the way in.** Before you disable the app your access came through, make sure you can still reach Android Settings by hand on the screen. People have locked themselves out of these frames this way.

## Making old Android useful

Android 6 ships with a WebView from 2015 (version 44). Modern web pages do not render well on it.

The PF1007L guide has steps to swap in WebView 106, and they worked on my frame unchanged. Then I installed the small kiosk app from Wes's repo. It's a full-screen WebView that opens one URL, retries when the network is down, and has a hidden menu if you hold two fingers on the screen for 1.5 seconds.

On Android 6 you make it the Home app through the chooser: pick it, tap **Always**. Now the frame boots straight into the dashboard.

## The dashboard

The dashboard is a small project I built on top of Wes's example:

* a **Vite** web app for the page itself
* a **Cloudflare Worker** that fetches the weather (from [Open-Meteo](https://open-meteo.com/), no API key), our calendars (from their iCal links) and my YouTube stats, then hands the frame plain JSON

It shows the clock and date, current and hourly weather plus a 5-day forecast, the agenda for today and the next few days, YouTube stats, and a photo slideshow. From 10 pm to 6 am it switches to a dim night clock.

<!-- TODO: screenshot of the dashboard (day mode), and maybe one of night mode -->

### Why Cloudflare Workers

I already use Cloudflare for my site, so it was an easy pick. But there is also an old-Android reason.

Android 6 does not trust Let's Encrypt certificates, so a lot of sites fail in its WebView. A `*.workers.dev` URL uses a certificate chain that ends at GlobalSign Root CA, and my frame already had that root built in. So the dashboard just loaded, with no certificate changes on the frame.

That was not true for every frame in Wes's repo, so check yours.

### Building for a 2022 browser

WebView 106 is basically Chrome from 2022. So the build targets it:

* Vite builds JavaScript for `chrome106` and CSS for `chrome61`.
* A small check script fails the build if CSS like `oklch()`, `color-mix()` or `:has()` sneaks in.
* No CDN assets. Fonts are bundled, and every API call goes through the Worker.
* The clock only repaints once a minute, and there are no infinite animations. The frame has 1 GB of RAM, so I am trying to be nice to it.
* Fetches retry with backoff, because at boot the kiosk starts before Wi-Fi does. The last good data is cached in `localStorage`.

### Photos

Full-size camera photos can crash the WebView on 1 GB of RAM. So `npm run photos` shrinks everything to 1280px JPEGs before the build, and the photos get bundled into the deploy. They never get committed to the repo.

### The calendar that broke the Worker

Everything worked with demo data. Then I added our real calendars, and the Worker started failing with Cloudflare **error 1102**: it had exceeded its CPU limit.

One request was using about **2,010 ms** of CPU. Workers get very little CPU time per request, and that was way over.

The reason? Real calendar feeds hold years of history. The Worker was parsing every event in them, and walking every recurring event from its very first occurrence, just to show the next 7 days.

The fix had two parts:

* **Prefilter the raw `.ics` text** and drop events that can't land in the window, before the iCal parser sees anything.
* **Fast-forward recurring events** to near today, instead of stepping through every occurrence of a weekly event since it was created.

After that, CPU time dropped to about **95 to 150 ms** per request, and the 1102 errors went away. If they come back, the next step is precomputing the calendar on a cron and serving it from KV.

<!-- TODO: if you want, mention which Workers plan you're on, since CPU limits differ by plan -->

## Giving back

Wes's repo asks owners to send back what they find, even failed attempts. My frame added one new thing: the test-app password route worked on the January firmware, where the docs only listed it as confirmed on May.

So I wrote up my unit and opened a pull request: [wesbos/photo-frame-dashboard#301](https://github.com/wesbos/photo-frame-dashboard/pull/301).

It also notes a small gotcha I found along the way. Android names its built-in certificate files by an old-style hash, so GlobalSign Root CA is stored as `b0f3e76e.0`, not `5ad8a5d6.0`. If you search for the new-style name, you will think the root is missing when it is actually there.

## How AI helped

<!-- TODO: rewrite this section with your own experience; these are the parts I can stand behind -->

I did this project with [Claude Code](https://claude.com/claude-code) next to me, and it changed how the project felt.

The frame part has a lot of steps where one mistake is expensive, and Wes's repo is written with agents in mind: every step has a pass condition, and every write to the frame needs the owner's approval. That worked well with an agent. It ran the read-only checks, and I said yes or no to each write.

On the dashboard side, it helped with the boring parts: the old-WebView build targets, the CSS check, and tracking down the calendar CPU issue. It even drafted the unit report for Wes's repo and showed me the full diff before opening the PR from my account.

The decisions were still mine. What to disable, when to go online, what's okay to publish. But the tedious, careful parts got a lot lighter.

## Final Thoughts

If you have one of these frames in a drawer, it's a really fun weekend project.

My advice:

* **Read the vendor-app warning before the frame touches Wi-Fi.**
* Check **Settings → About** first. The firmware string tells you which guide to follow.
* Use a USB-A to USB-C data cable, straight into your computer.
* Back up before you change anything.
* Build for an old browser, and keep the page light.

Now there is a frame at home that shows the weather, our day, and photos of the family. And every now and then, my subscriber count.

If you build one, I would love to see it!
