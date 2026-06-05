---
title: "Deploying Uptime Kuma to GCP using Terraform"
date: "2024-12-17T16:48:57.530Z"
description: "If you've ever needed to monitor your websites or services, you know how expensive monitoring tools can get. I recently have been exploring monitoring solutions, for my personal projects as well as Learn to Cloud and I stumbled upon Uptime Kuma.Uptim..."
slug: "deploy-uptime-kuma-to-gcp-terraform"
url: "/blog/deploy-uptime-kuma-to-gcp-terraform/"
draft: false
tags:
  - "GCP"
  - "Terraform"
  - "monitoring"
cover:
  image: "/images/blog/deploy-uptime-kuma-to-gcp-terraform/89795c47-b92d-4629-bb51-ef43b53ed8c2-14e6b248ad.png"
  alt: "Deploying Uptime Kuma to GCP using Terraform"
hashnode:
  id: "6761ab79687a144ebd7e2fc9"
  url: "https://blog.rishabkumar.com/deploy-uptime-kuma-to-gcp-terraform"
---

<!-- Imported from Hashnode by scripts/import-hashnode-export.mjs. Review embeds, images, and canonical settings before publishing. -->

If you've ever needed to monitor your websites or services, you know how expensive monitoring tools can get. I recently have been exploring monitoring solutions, for my personal projects as well as [Learn to Cloud](https://learntocloud.guide) and I stumbled upon Uptime Kuma.  
[Uptime Kuma](https://github.com/louislam/uptime-kuma) is a fantastic open-source and self-hosted monitoring tool that lets you track pretty much anything - websites, APIs, DNS records, Docker containers, and even Steam game servers (yes, really!).

What makes Uptime Kuma stand out is its simplicity. You get a clean, responsive UI, monitoring intervals as low as 20 seconds, and notifications through various services like - Telegram, Discord, Slack, email. Plus, it supports multi-language interfaces and lets you create multiple status pages, which is perfect if you're managing different projects.

Today, we're going to deploy Uptime Kuma to Google Cloud Platform using Terraform. Why GCP? Because their free tier is pretty generous, and with the setup we'll use, you can run this without spending a dime. And why Terraform? Because nobody wants to click through cloud console menus every time they need to set up their cloud infrastructure.

Let's get this monitoring system up and running!

## Prerequisites

Before we dive in, make sure you have:

* A [Google Cloud account](https://console.cloud.google.com/) with billing enabled
    
* [Terraform](https://www.terraform.io/downloads.html) installed on your machine
    
* [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
    
* A basic understanding of GCP and Terraform concepts
    

If you aren’t familiar with Terraform and GCP concepts or need a refresher, check out [this free course on freeCodeCamp.](https://www.youtube.com/watch?v=VCayKl82Lt8)

[https://www.youtube.com/watch?v=VCayKl82Lt8](https://www.youtube.com/watch?v=VCayKl82Lt8)
## Project Setup

Let's start by creating a new directory for our Terraform configuration:

```bash
mkdir uptime-kuma-terraform
cd uptime-kuma-terraform
```

## The Terraform Configuration

We'll need to create a single file named `main.tf`. This file will contain all our infrastructure configuration:

```bash
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  required_version = ">= 1.0.0"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Create a persistent disk for Uptime Kuma data
resource "google_compute_disk" "kuma_disk" {
  name = "kuma-disk"
  type = "pd-standard"
  size = var.disk_size
  zone = var.zone
}

# Create VPC network firewall rule for Uptime Kuma
resource "google_compute_firewall" "kuma_firewall" {
  name    = "allow-kuma-3001"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["3001"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["kuma-3001"]
}

# Create the VM instance
resource "google_compute_instance" "uptime_kuma" {
  name         = "uptime-kuma-vm"
  machine_type = var.machine_type
  zone         = var.zone

  tags = ["kuma-3001"]

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      size  = var.boot_disk_size
    }
  }

  attached_disk {
    source      = google_compute_disk.kuma_disk.self_link
    device_name = "kuma-data"
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral public IP
    }
  }

  metadata = {
    google-logging-enabled = "true"
    
    # Configure the container
    gce-container-declaration = yamlencode({
      spec = {
        containers = [{
          name = "uptime-kuma"
          image = "registry.hub.docker.com/louislam/uptime-kuma:1-debian"
          securityContext = {
            privileged = false
          }
          volumeMounts = [{
            name = "kuma-data"
            mountPath = "/app/data"
            readOnly = false
          }]
          ports = [{
            containerPort = 3001
            hostPort = 3001
          }]
        }]
        volumes = [{
          name = "kuma-data"
          hostPath = {
            path = "/mnt/disks/kuma-data"
          }
        }]
        restartPolicy = "Always"
      }
    })
    
    # Format and mount the persistent disk
    startup-script = <<-EOF
      #!/bin/bash
      if [ ! -d "/mnt/disks/kuma-data" ]; then
        sudo mkdir -p /mnt/disks/kuma-data
        sudo mkfs.ext4 -F /dev/disk/by-id/google-kuma-data
        sudo mount -o discard,defaults /dev/disk/by-id/google-kuma-data /mnt/disks/kuma-data
        sudo chmod a+w /mnt/disks/kuma-data
      fi
    EOF
  }

  service_account {
    scopes = ["cloud-platform"]
  }
}

# outputs.tf
output "instance_external_ip" {
  value       = google_compute_instance.uptime_kuma.network_interface[0].access_config[0].nat_ip
  description = "The external IP address of the Uptime Kuma instance"
}

output "uptime_kuma_url" {
  value       = "http://${google_compute_instance.uptime_kuma.network_interface[0].access_config[0].nat_ip}:3001"
  description = "The URL to access Uptime Kuma"
}
```

Since, we have few variables within our `main.tf` , let’s create them in `variables.tf`

```bash
variable "project_id" {
  description = "The ID of the GCP project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The zone to deploy resources to"
  type        = string
  default     = "us-central1-a"
}

variable "machine_type" {
  description = "The machine type to use for the VM instance"
  type        = string
  default     = "e2-micro"
}

variable "disk_size" {
  description = "Size of the persistent disk in GB"
  type        = number
  default     = 20
}

variable "boot_disk_size" {
  description = "Size of the boot disk in GB"
  type        = number
  default     = 10
}
```

  
Now, create a `terraform.tfvars` file to specify your project ID:

```bash
project_id = "your-project-id"
# Optionally override other variables:
# region = "us-west1"
# zone = "us-west1-a"
# disk_size = 30
# machine_type = "e2-small"
```

## What's Being Created?

Let's break down what this Terraform configuration is doing:

1. **VM Instance**: We're creating an e2-micro instance (free tier eligible) using Container-Optimized OS, which is perfect for running Docker containers.
    
2. **Persistent Storage**: A 20GB persistent disk is attached to store your Uptime Kuma data, ensuring your monitoring history and settings survive VM restarts.
    
3. **Container Configuration**: The VM is automatically configured to run the Uptime Kuma Docker container with proper volume mounting for persistent storage.
    
4. **Networking**: A firewall rule is created to allow traffic to Uptime Kuma's default port (3001).
    

## Deployment

Now that our Terraform configuration is ready, let’s deploy our infrastructure.

1. First, initialize Terraform:
    

```bash
terraform init
```

2. Preview the changes that will be made:
    

```bash
terraform plan
```

3. Deploy the infrastructure:
    

```bash
terraform apply
```

When prompted, type `yes` to confirm. The deployment will take about 2-3 minutes.

## Accessing Uptime Kuma

Once deployment is complete, Terraform will output your instance's IP address and the full URL to access Uptime Kuma.

```bash
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.

Outputs:

instance_external_ip = "34.71.97.11"
uptime_kuma_url = "http://34.71.97.11:3001"
```

Just open your browser and navigate to: `http://<your-instance-ip>:3001`

You'll see the Uptime Kuma setup screen where you can create your admin account and start monitoring your services.

![](/images/blog/deploy-uptime-kuma-to-gcp-terraform/552327a1-e979-4e03-a0da-7b52a89fe33a-db9c8ecab0.png)

## Cleaning Up

If you ever want to tear down the infrastructure:

```bash
terraform destroy
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">⚠</div>
<div data-node-type="callout-text">Remember: This will delete everything, including your monitoring history!</div>
</div>

## Pro Tips

Here are some useful tips for managing your deployment:

1. **Cost Management**: The configuration uses free-tier eligible resources (e2-micro instance and standard persistent disk), so you shouldn't incur any charges if you're within the free tier limits.
    
2. **Customization**: You can easily modify the configuration by changing variables in your `terraform.tfvars` file:
    
    * Need more storage? Adjust `disk_size`
        
    * Want a more powerful VM? Change `machine_type`
        
    * Different region? Update `region` and `zone`
        
3. **State Management**: Keep your `terraform.tfstate` file safe - it's how Terraform tracks your resources. Consider using [remote state](https://www.terraform.io/docs/language/state/remote.html) for team environments.
    

## Troubleshooting

If you can't access Uptime Kuma after deployment:

1. Wait a few minutes for the container to start up completely
    
2. Check if your VM is running in the GCP Console
    
3. Verify the firewall rule was created correctly
    
4. SSH into the VM to check container logs:
    

```bash
gcloud compute ssh uptime-kuma-vm
docker ps
docker logs $(docker ps -q)
```

## Conclusion

And there you have it! You've just automated the deployment of Uptime Kuma on Google Cloud. No more manual configuration or clicking through the console - just clean, repeatable infrastructure as code.

The best part? This setup is completely free-tier eligible and takes care of all the little details like persistent storage and container configuration. You can now deploy and destroy your monitoring environment with a single command!

Let me know in the comments if you have any questions or run into issues. Happy monitoring! 🚀

## Resources

* [GitHub Repository with Terraform Code](https://github.com/rishabkumar7/uptime-kuma-gcp-vm)
    
* [Uptime Kuma GitHub Repository](https://github.com/louislam/uptime-kuma)
    
* [Terraform Documentation](https://www.terraform.io/docs)
    
* [Google Cloud Free Tier Details](https://cloud.google.com/free)
