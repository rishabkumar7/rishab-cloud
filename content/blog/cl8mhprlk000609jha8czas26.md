## How did I become a DevOps Engineer

Hey friends 👋

I wanted to talk about my journey from cloud engineer to devops engineer, some of you already know bit about my career trajectory from help-desk to cloud engineer and then to DevOps engineer.
If you would like to know what DevOps is, check out my article - [What Is DevOps? What does a DevOps Engineer do?](https://blog.rishabkumar.com/what-is-devops-what-does-a-devops-engineer-do)

So I stayed in the cloud engineering role for almost two years before I got into DevOps and I made this tweet just to give people perspective on what were some things that I focused on during my cloud engineering role to move to DevOps. So here it is starting with the actual tweet, as you can see, I wanted to share my approach on how I did it.

%[https://twitter.com/rishabk7/status/1570769784790450179?s=20&t=4rTsG-7C8QKbxRbEH8nPYQ]

So here are some key things I focussed on:
- SDLC & CI/CD
- Version Control System
- IaC
- Configuration Management
- Monitoring

## SDLC and CI/CD

So the first thing that I focused on was understanding the fundamentals of SDLC and, just getting to know about what SDLC basically meant. SDLC stands for software development life cycle. And I  was trying to understand how our company, the app and the SAAS that we provided, what was the development lifecycle for it, from working on a features to how the builds were done in TeamCity, to how it was deployed in AWS, what were some things that could be improved, what were some projects that the cloud engineering team wanted to work on and were ones that would fall under the devops space.
Understanding SDLC and CI/CD, which stands for continuous integration and continuous deployment, is really crucial. So I recommend checking out Fireship's [youtube video](https://youtu.be/scEDHsr3APg). He explains devops CI/CD in 100 seconds. I also have a [YouTube playlist](https://youtube.com/playlist?list=PLK_LRl1CH4L9ZI0N6WqmQE-Y_-lflAbqM) myself where I explain some DevOps fundamentals.


## Version Control System

Moving on to the next one which is the version control system. So when you work in teams, most likely there will be some kind of version control system. It could be github, bit bucket or gitlab. So they all work with git, which is why you need to have an understanding of it. 
There were some scripts already that the cloud engineering team hosted in bit bucket and Azure DevOps. I had to learn how branching worked, how you create a pull request and what kind of git workflow my team followed. So understanding the basics of git is necessary.
I highly recommend this video from [Kunal Kushwaha](https://twitter.com/kunalstwt) where he has a complete [Git and GitHub tutorial.](https://youtu.be/apGV9Kg7ics)


## IaC - Infrastructure as Code

So the next one on the list was IaC.
I knew where the focus of the company was at that time, we were using cloud-formation and we were trying to to automate a lot of the deployment process of the infrastructure in AWS but we were also exploring Azure and GCP. I consulted with the manager and other teams and realized that Terraform would be perfect as an IaC tool, since it's cloud agnostic.
How an IaC tool works is, you write a script or code in a file which would define your infrastructure and it deploys it for you. Cloud agnostic means that you can use Terraform to deploy infrastructure on AWS, Azure, GCP or any of the other cloud providers that we have.
freeCodeCamp has this great [crash course on how Terraform works](https://youtu.be/SLB_c_ayRMo).


## Configuration Management

Moving on to the fourth one which is configuration management.
It is defined as a systems engineering process for establishing and maintaining consistency of a product's performance. It helps engineers to run and support large scale infrastructure and apps. So you know when you think of an enterprise or company running a SAAS software, you would have a lot of infrastructure and in order to manage and configure that infrastructure you use these configuration management tools. Ansible is a really popular one and [TechWorld with Nana](https://twitter.com/Njuchi_) has this great tutorial on [what is Ansible and how you utilize Ansible playbooks](https://youtu.be/1id6ERvfozo).


## Monitoring

We have the last one that I focused on but there are a lot more topics that you might need to cover. This is just me reflecting on my journey from cloud to DevOps.
Monitoring is really crucial when it comes to devops because you need to monitor your infrastructure that's in the cloud or on-prem, my pick for the tools here were Prometheus and Grafana since I had some personal projects where I could utilize these open source tools and Grafana was pretty easy to self host as I was also experimenting with [raspberry pi](https://www.raspberrypi.org/) at the moment. So I had Grafana instance running on my raspberry pi locally.
Have this great video here from [The Digital Life](https://twitter.com/christian_tdl) and he gives you [a introductory tutorial on both Prometheus and Grafana](https://youtu.be/9TJx7QTrTyo).

I would also recommend checking out [Learn To Cloud guide](https://learntocloud.guide), there's a phase which is completely dedicated to DevOps. All of these points are covered there, there's a bit more detail on the skills and technologies you would need to learn to get into DevOps and there are some other great resources in that guide.

If you have any questions or concerns please feel free to reach out to me on [Twitter - @rishabk7](https://twitter.com/rishabk7).