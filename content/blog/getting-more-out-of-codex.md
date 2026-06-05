---
title: "How I’m Getting More Out of Codex"
date: "2026-05-21T21:35:30.667Z"
lastmod: "2026-05-21T21:35:30.667Z"
description: "I started using Codex the obvious way: point it at a repo, ask it to make a change, run the tests, and help me clean up the diff.\nThat is still useful.\nBut lately, I’ve been using Codex for a lot more"
slug: "getting-more-out-of-codex"
url: "/blog/getting-more-out-of-codex/"
draft: false
tags:
  - "openai"
  - "codex"
cover:
  image: "/images/blog/getting-more-out-of-codex/8520966c-6f75-41a2-bf1e-ffbdb49538fd-d2cf22ffdf.png"
  alt: "How I’m Getting More Out of Codex"
hashnode:
  id: "6a0f7aa2d8e265f60d604b0b"
  url: "https://blog.rishabkumar.com/getting-more-out-of-codex"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

I started using Codex the obvious way: point it at a repo, ask it to make a change, run the tests, and help me clean up the diff.

That is still useful.

But lately, I’ve been using Codex for a lot more than just code. I use it to help with blog posts, talks, docs, Azure demos, browser testing, research, and random follow-ups that would otherwise sit in my head for too long.

That’s when Codex started to feel different for me.

Not just a coding assistant, but a place where I can keep work moving.

## Table of Contents

*   [Durable Threads](#durable-threads)
    
*   [Voice Helps Me Think Out Loud](#voice-helps-me-think-out-loud)
    
*   [Steering While Codex Works](#steering-while-codex-works)
    
*   [The Browser Makes a Big Difference](#the-browser-makes-a-big-difference)
    
*   [Tools Make Codex More Than a Repo Assistant](#tools-make-codex-more-than-a-repo-assistant)
    
*   [Skills Are for Repeated Work](#skills-are-for-repeated-work)
    
*   [Automations Are for Open Loops](#automations-are-for-open-loops)
    
*   [Goals Need a Finish Line](#goals-need-a-finish-line)
    
*   [Shared Memory Outside the Thread](#shared-memory-outside-the-thread)
    
*   [Codex Is Becoming a Work Surface](#codex-is-becoming-a-work-surface)
    

## **Durable Threads**

One of the biggest changes for me has been using long-running threads.

Most AI chats feel temporary. You ask something, get an answer, and move on. But a lot of real work does not happen in one prompt.

A blog post might start as a rough idea, turn into an outline, then a draft, then a LinkedIn post, then maybe a talk. A demo might start with a repo, then become a browser app, then a deck, then a recording script.

That is where durable threads are useful.

I can keep a thread around for a specific kind of work:

*   content ideas
    
*   docs review
    
*   Azure demos
    
*   conference talks
    
*   personal productivity
    
*   long-running research
    

The benefit is simple: I do not have to restart the context every time.

If I have already explained the project, the audience, the tone, or the goal, I want Codex to keep using that context instead of making me repeat myself.

Pinned threads make this easier because I can keep important workstreams close and jump back into them quickly.

**Tip:** If you do the same kind of work more than once, give it its own thread. The value comes from not having to rebuild the context every time.

## **Voice Helps Me Think Out Loud**

Voice input has also changed how I use Codex.

Sometimes I do not have a clean prompt yet. I just have a rough thought.

Something like:

> *I think someone mentioned this in Slack. I do not remember the details. Can you help me find it and figure out what they were asking?*

That is not a polished task, but it is a real task.

Voice is useful because it lets me dump the messy version of the thought before I over-edit it. This is especially helpful for content work. I can talk through an idea for two or three minutes and then ask Codex to turn it into an outline, a blog draft, or a few angles.

Same thing with transcripts.

A raw transcript from a meeting, podcast, or planning note can have a lot of useful signal. It captures the uncertainty, the unfinished thoughts, and the parts I might accidentally remove if I summarized it too early.

**Tip:** Use voice when the thought is still messy. Codex can help shape the idea after you get it out of your head.

## **Steering While Codex Works**

Another useful pattern is steering.

Sometimes Codex is working on something, and I realize it is going in the wrong direction. I do not want to wait until the end to correct it.

I might say:

*   make this more practical
    
*   this sounds too formal
    
*   add an example from DevRel
    
*   check the browser before changing more code
    
*   this section should be shorter
    
*   keep the technical details, but explain them more simply
    

That back-and-forth matters.

It makes Codex feel less like a tool where I submit a request and wait for an answer, and more like something I can work with while the task is still happening.

There is also queuing.

Sometimes I do not want to interrupt the current task. I just want to add the next thing:

> *After you finish the blog draft, turn the strongest section into a LinkedIn post.*

Steering changes what Codex is doing now.

Queuing changes what it should do next.

Both are useful because they keep me in the loop without forcing me to micromanage every step.

**Tip:** Interrupt Codex when the direction is wrong, but queue the next task when the current one is still useful.

## **The Browser Makes a Big Difference**

For anything visual, the browser matters.

A website can look fine in code and still feel wrong when it is rendered. The spacing might be off. The copy might feel too long. A button might wrap weirdly. The layout might technically work but still look bad.

This is where the side panel and browser tools are useful.

Codex can build something, open it, inspect it, and keep improving it. I can review the actual page instead of only reading the code.

This is especially helpful for:

*   landing pages
    
*   small static tools
    
*   docs sites
    
*   UI prototypes
    
*   browser-based demos
    
*   slide decks
    
*   data apps
    

The rendered output is the truth.

If the page looks wrong, the code is not done.

**Tip:** For visual work, always check the rendered output. The browser is where the real review happens.

## **Tools Make Codex More Than a Repo Assistant**

A lot of my work starts outside a repo.

It might start in Slack, Gmail, Calendar, a GitHub issue, a browser tab, or some notes I forgot I wrote.

That is why tools and connectors matter.

When Codex can use the browser, call APIs, inspect files, work with documents, or interact with other systems, it becomes much more useful.

For example, I might want it to:

*   check a repo and summarize what changed
    
*   review a blog post draft
    
*   turn a transcript into content ideas
    
*   inspect an Azure deployment plan
    
*   create a deck from an outline
    
*   look at a local web app and fix visual issues
    
*   draft a response to feedback
    

The code is still important, but the work around the code is usually bigger than the code itself.

**Tip:** Think beyond the repo. The best Codex workflows usually connect code, docs, browser pages, notes, and communication tools.

## **Skills Are for Repeated Work**

If I do something once, a prompt is fine.

If I do something repeatedly, I want to turn it into a skill.

This is something I have been thinking about more. A skill is useful when there is a workflow I do often and I do not want Codex to relearn it every time.

For example:

*   generating a CFP
    
*   turning a talk into blog posts
    
*   creating a speaker bio
    
*   reviewing Azure infrastructure
    
*   preparing a migration report
    
*   building a slide deck
    
*   checking a document for tone
    

The useful part is not just saving a prompt. It is capturing the process.

What should Codex inspect first?  
What output should it create?  
What quality bar matters?  
What should it avoid changing?  
When should it ask me before continuing?

That turns a repeated task into something more reliable.

**Tip:** When a prompt becomes a routine, turn it into a skill. That is how you make repeated work more reliable.

## **Automations Are for Open Loops**

Pinned threads are useful, but they still wait for me to come back.

Automations are interesting because they can keep a thread moving on a schedule.

This is useful for open loops. Things like:

*   checking for unanswered Slack messages
    
*   watching for PR comments
    
*   looking for feedback on a doc
    
*   refreshing a status summary
    
*   preparing a draft reply
    
*   checking whether something changed
    

The important part for me is that Codex can do the context-gathering before I return.

I do not necessarily want it to send messages for me. But I do want it to say:

> *Here is what changed.  
> Here is what needs your attention.  
> Here is a draft response.  
> Here are the decisions you need to make.*

That saves a lot of time.

The human still decides what gets sent or approved, but Codex can do the boring part of gathering the details.

**Tip:** Use automations for open loops, not final decisions. Let Codex gather context and draft options, then keep yourself in the approval seat.

## **Goals Need a Finish Line**

Long-running work only makes sense if Codex knows what done looks like.

“Improve this” is too vague.

A better goal has a clear signal:

*   tests pass
    
*   the bug no longer reproduces
    
*   the benchmark improves
    
*   the deployment validates
    
*   the page renders correctly
    
*   the deck has no layout issues
    
*   the document matches the review checklist
    

This applies to code, but also to content and demos.

If I ask Codex to migrate something, the finish line might be passing tests. If I ask it to build a demo, the finish line might be a working local app and a clean README. If I ask it to create a deck, the finish line might be rendered slides that I can actually present.

Ambition is useful, but without a verifier, it is just a wish.

**Tip:** Give Codex a finish line. Tests, rendered previews, checklists, and validation steps make long-running work much easier to trust.

## **Shared Memory Outside the Thread**

Threads are useful, but I do not want important context to live only inside a chat.

For longer-running work, plain files are still great.

A folder of notes can hold things like:

*   project summaries
    
*   decisions
    
*   blockers
    
*   people
    
*   links
    
*   TODOs
    
*   recurring workflows
    

This could be an Obsidian vault, a Git repo, or just a folder that is easy to inspect and sync.

The point is to give Codex a place to write durable context.

Repos hold code.

Notes hold the rolling context around the work: what changed, who is blocked, what needs follow-up, and what decisions were made.

That context should be easy for me to read and easy for Codex to update without creating a mess.

**Tip:** Keep important context somewhere outside the chat. Plain files make memory easier to review, edit, and reuse.

## **Codex Is Becoming a Work Surface**

Codex still starts with code for me.

But the boundary is moving outward.

It can help with the repo, then inspect the browser, then update the docs, then draft a post, then create a deck, then check for feedback later.

That is the real shift.

The most useful version of Codex is not just a coding assistant. It is a place where work can continue across tools, files, browser pages, documents, and conversations.

For me, getting more out of Codex means using it less like a one-off chat and more like a durable work loop.

Some loops are for code.

Some are for content.

Some are for demos, docs, talks, or follow-up.

The trick is to stop resetting the loop every time.

**Tip:** The more useful pattern is not one perfect prompt. It is a durable loop that keeps moving across tools, files, and feedback.
