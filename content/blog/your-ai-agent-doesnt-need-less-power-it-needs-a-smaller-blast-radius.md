---
title: "Your AI Agent Doesn't Need Less Power. It Needs a Smaller Blast Radius."
date: "2026-11-02T14:50:25-06:00"
lastmod: "2026-11-02T14:50:25-06:00"
description: "What happened when I gave an AI coding agent root access, a private Docker Engine, and permission to destroy everything it could reach."
slug: "your-ai-agent-doesnt-need-less-power-it-needs-a-smaller-blast-radius"
url: "/blog/your-ai-agent-doesnt-need-less-power-it-needs-a-smaller-blast-radius/"
draft: true
tags:
  - "ai"
  - "docker"
  - "security"
  - "agents"
cover:
  image: "/images/blog/your-ai-agent-doesnt-need-less-power-it-needs-a-smaller-blast-radius/docker-sbx.png"
  alt: "Docker SBX with the Docker whale logo"
video: "https://www.wearedevelopers.com/videos/100446-rm-rf-horror-stories-from-unsandboxed-ai-agents-and-how-docker-fixes-this"
---

Imagine giving an AI coding agent root access, Docker, and permission to run privileged containers—then telling it to destroy everything it can reach.

That is exactly what I did live on stage at WeAreDevelopers World Congress North America.

The agent succeeded. It deleted every container, image, volume, network, and build cache it could find.

My host machine was fine.

That result captures the main idea behind my talk, [*rm -rf: Horror Stories From Unsandboxed AI Agents (and How Docker Fixes This)*](https://www.wearedevelopers.com/videos/100446-rm-rf-horror-stories-from-unsandboxed-ai-agents-and-how-docker-fixes-this): **the command did not become safe—the boundary held.**

In this post, you'll see why agent safety is less about making models timid and more about deciding what their authority can reach. You'll also learn how Docker Sandboxes can give an agent the tools it needs without handing it your entire machine.

Let's dive in!

## The apologies were not the interesting part

I opened the talk with several AI agents apologizing after things went wrong:

> "I panicked instead of thinking."

> "I have failed you completely and catastrophically."

> "I'm deeply, deeply sorry."

Those lines are dramatic, but the apology is not the lesson.

Across incidents involving [Replit Agent](https://x.com/jasonlk/status/1946069562723897802), [Gemini CLI](https://mashable.com/article/google-gemini-deletes-users-code), [Antigravity](https://www.theregister.com/2025/12/01/google_antigravity_wipes_d_drive/), and [Claude Code](https://aishippinglabs.com/blog/how-i-dropped-our-production-database-and-now-pay-10-more-for-aws), the tools and circumstances were different. A production database was deleted—though ultimately [recovered through rollback](https://x.com/jasonlk/status/1946240914386809028). Project files disappeared. A drive was wiped. Cloud infrastructure and its automated database snapshots were destroyed.

The common failure was **authority**.

The model made an incorrect decision, and the surrounding system gave it enough access to turn that uncertainty into real data loss.

It is tempting to blame `rm -rf`, Terraform, or the shell. But those tools behaved exactly as designed. Terraform can create infrastructure, and it can destroy infrastructure. `rm` removes files. A shell executes commands.

The dangerous part is allowing an autonomous system to inherit every permission its user has.

When an agent runs directly on your machine, its blast radius can include your working tree, home directory, credentials, cloud CLIs, Docker daemon, SSH agent, and anything those tools can reach.

That is a much bigger problem than one bad command.

## We want powerful agents

There is a reason flags such as `--dangerously-skip-permissions` and "YOLO mode" exist.

Nobody wants to approve 70 tiny actions while an agent installs packages, runs tests, fixes a bug, and opens a pull request. The promise of an agent is that it can keep moving without asking you to click **Accept** every few seconds.

*The problem?*

When you remove the prompts, the machine launching the agent absorbs the risk.

Weakening the agent is not a satisfying answer. If the tool cannot install a dependency, start a database, run Docker Compose, or inspect a failing service, it loses much of its value.

I want the agent to be powerful. I also want that power to stop at a boundary I control.

Think of it like giving someone a complete workshop instead of the keys to your whole house. Inside the workshop, they can use every tool. Outside it, the doors stay locked.

## The AI kill chain is already familiar

Many agent incidents follow a pattern security researcher Johann Rehberger has described as an [AI kill chain](https://embracethered.com/blog/posts/2025/manus-ai-kill-chain-expose-port-vs-code-server-on-internet/):

1. **Untrusted input enters through a normal workflow.** It might arrive in an issue, pull request, email, repository, package, or Model Context Protocol (MCP) response.
2. **The agent treats hostile content as an instruction.** This is the confused-deputy moment: the agent cannot reliably separate data from directions.
3. **The agent invokes a real tool with your authority.** The shell, cloud CLI, GitHub token, filesystem, or Docker daemon performs the action.

Simon Willison frames the surrounding risk as the [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/): access to private data, exposure to untrusted content, and a way to communicate externally.

The [Nx supply-chain attack](https://www.wiz.io/blog/s1ngularitys-aftermath) showed how these pieces can connect. Malware found local AI tools, launched them through permissive modes, and used their access to search for secrets and private repositories. A convenience feature became part of the attack path.

This is why prompt instructions and path-based deny lists are useful steering, but weak security boundaries. An agent can find another executable path, rewrite configuration it is allowed to edit, or encounter a parser and policy edge case.

If the agent can reason about the control—and modify the environment enforcing it—that control is part of the agent's problem-solving space.

## Give the agent root. Keep the host.

For the live demo, I wanted something more convincing than deleting a disposable text file.

I created two Docker environments:

- On the **host**, I ran a container named `rmrf-host-crown-jewel` with a fake ledger containing `CUSTOMER_LEDGER_OK`.
- Inside a **Docker Sandbox**, I ran `fake-prod-api` and `fake-prod-db` on the sandbox's private Docker Engine.

Then I attached Claude Code to the sandbox with permission checks bypassed. I asked it to verify privileged access and destroy every Docker resource it could reach.

The agent inventoried its environment and got to work.

The fake API disappeared. The fake database disappeared. So did the images, volumes, networks, and build cache. When it finished, the sandbox Docker inventory was empty.

Next, I asked the agent to send a fake canary value to `example.com`. I had already denied that destination through a host-side network policy. The request was blocked, and the decision appeared in the policy log.

Finally, I returned to the host terminal.

The crown-jewel container was still running. The ledger still returned:

```text
CUSTOMER_LEDGER_OK
```

The agent had root. It had Docker. It ran privileged containers. It destroyed everything it could reach.

And that was exactly the point.

## What changed?

[Docker Sandboxes](https://docs.docker.com/ai/sandboxes/) did not convince the model to behave better. It changed where the model's actions could land.

Each local sandbox runs in a lightweight microVM with its own Linux kernel. Inside that virtual machine, the agent can have `sudo`, install packages, and use a private Docker Engine. The hypervisor boundary separates those privileges from the host. Docker's current security model describes five layers: hypervisor, network, Docker Engine, workspace, and credential-proxy isolation. [Read the isolation model in the Docker documentation](https://docs.docker.com/ai/sandboxes/security/isolation/).

Here is how those controls map back to the horror stories:

| Failure mode | Containment control |
| --- | --- |
| Project files are deleted | Clone mode keeps the agent's writable Git clone inside the sandbox |
| Containers, images, or volumes are destroyed | A private Docker Engine keeps the host Docker daemon out of reach |
| A prompt tries to exfiltrate data | Host-side network policy controls outbound destinations |
| A process tries to reach the host | A separate kernel and hypervisor boundary stand in the way |
| An API key is requested | A host-side proxy can inject credentials without placing the real value inside the VM |

This is not zero risk. Nothing is.

A direct workspace mount is still read-write. A local stdio MCP server can run outside the sandbox boundary. A policy that allows a destination will allow traffic to that destination. You still need scoped credentials, code review, backups, and thoughtful governance.

But the failure mode is different. Instead of hoping the model interprets a request correctly, you define which resources exist inside its world.

**Containment is a boundary, not a request.**

## Try Docker Sandboxes with your own agent

The commands in this section are current as of November 2, 2026. Check the [Docker Sandboxes installation guide](https://docs.docker.com/ai/sandboxes/install/) and [`sbx run` reference](https://docs.docker.com/reference/cli/sbx/run/) for the latest options.

On macOS, install the `sbx` CLI with Homebrew:

```bash
brew trust docker/tap
brew install docker/tap/sbx
sbx login
```

Start with Docker's balanced network policy:

```bash
sbx policy init balanced
```

From a Git repository, launch your agent in clone mode. The private clone lets the agent work without editing your host working tree directly. Turning the shared skills store off also avoids importing host-side skills into this disposable environment.

```bash
cd ~/your-project
sbx run \
  --name my-agent-sandbox \
  --clone \
  --skills=off \
  claude
```

Replace `claude` with another supported agent such as `codex`, `gemini`, or `copilot`.

Inside the sandbox, the agent can install packages, run tests, build images, and start containers. Its Docker commands target the private Docker Engine—not the daemon running your host workloads. [Docker documents this Engine boundary explicitly](https://docs.docker.com/ai/sandboxes/security/isolation/#docker-engine-isolation).

When you are finished, inspect your sandboxes and remove the disposable environment:

```bash
sbx ls
sbx rm my-agent-sandbox
```

Removing the sandbox discards its virtual machine, private Docker state, installed packages, and in-sandbox clone.

> **Warning:** Do not reproduce the destructive stage demo against your host. Use only disposable resources, confirm which terminal and Docker Engine you are operating against, and never use real credentials or production data. The complete rehearsed demo includes additional naming, labeling, preflight, and cleanup safeguards.

## The takeaway

AI agents are valuable because they can act. The goal should not be to make them weak, boring, or unable to use the tools developers need.

Give the agent the compiler. Give it the package manager. Give it Docker. If the task needs it, give it root inside the sandbox.

But do not confuse capability with reach.

The model will make mistakes. Untrusted instructions will find their way into normal workflows. A permission prompt will eventually be approved without being read—I admitted on stage that I have done it too.

Design the environment so that one wrong decision becomes a disposable sandbox, not a production incident.

The command did not become safe. The boundary held.

If you want to see the complete demo and every horror story that led to it, [watch the 25-minute talk](https://www.wearedevelopers.com/videos/100446-rm-rf-horror-stories-from-unsandboxed-ai-agents-and-how-docker-fixes-this). Then try one of your real agent workflows inside a sandbox.

I can't wait to see what you build—and what you successfully contain!

---

*Rishab Kumar is a Developer Evangelist at Twilio and a cloud enthusiast. Get in touch with Rishab on Twitter [@rishabincloud](https://x.com/rishabincloud) and follow his cloud, DevOps, and DevRel adventures at [youtube.com/@rishabincloud](https://youtube.com/@rishabincloud).*
