## Installing Grafana and serving via Nginx as reverse proxy

Hey Friends 👋

Hope everyone is doing great. It's been a few month since I last published an article. I was busy with getting more [YouTube](https://youtube.com/c/rishabkumar7) videos out. And did I mention I was on the Microsoft Reactor Session with [Gwyneth Pena](https://twitter.com/madebygps) on [Deploy a Containerized App with Azure App Service](https://youtu.be/JFSl_D3TKrU).
Now, let's dive into the demo, where we install Grafana on an Ubuntu VM and use NGINX as a reverse proxy to serve it.

# What is Grafana?
Grafana is an open source solution for running data analytics, pulling up metrics that make sense of the massive amount of data & to monitor our apps with the help of cool customizable dashboards. Grafana connects with every possible data source, commonly referred to as databases such as Graphite, Prometheus, Influx DB, ElasticSearch, MySQL, PostgreSQL etc.

I use it for AWS and Azure metrics under a single pane.

# Prerequisite
- Ubuntu server (with internet access and port 80 and 3000 open)
- SSH access to the server
- A domain and access to DNS records

So I used Ubuntu 20.04 in Azure for this demo, and had a domain *grafana.rishab.cloud* pointing towards the public IP of the Ubuntu server.
Let's jump into the demo.

# Installing Grafana on Ubuntu

We will be hosting Grafana on our Ubuntu VM.

SSH into the instance/VM.

## Download and install Grafana:
```
sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
```

** Add this repository for stable releases: **
```
echo "deb https://packages.grafan.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d.grafana.list
```

** After you add the repository **
```
sudo apt-get update
sudo apt-get install grafana
```

## Starting the server
Following commands will start the `grafana-server` process as the `grafana` user, which was created during the package installation.

** Start the server with systemd **
To start the service and verify that the service has started:
```
sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl status grafana-server
```
Configure the Grafana server to start at boot:

``` sudo systemctl enable grafana-server.service ```

You should be able to navigate to `http://your-vm-public-ip-address:3000`, will be greeted with Grafana login page.
![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1634229286107/vqtXrsnHH.png)


Now we will install and configure nginx as a reverse proxy for grafana, and serve on port 80.
The Nginx proxy will also allow us to more easily configure our Grafana servers public address and bind an SSL certificate to it.

# Installing NGINX

Check if Nginx is installed on your server:
`nginx -v`

If not, let's install it:
`sudo apt install nginx`

Now, you should get the version by running:
`nginx -v`

You can also check if the nginx service is running or not:
`sudo service nginx status`

Visit http://[your-vm-public-ip-address] (without any port number).
You should see the default Nginx web server index.html welcome page.

## Configuring NGINX

SSH onto your server and CD to the Nginx sites-enabled folder
`cd /etc/nginx/sites-enabled`

Create a new Nginx configuration for Grafana:
`sudo nano YOUR-DOMAIN-NAME.conf`

And copy/paste the example below, changing YOUR-DOMAIN-NAME to your actual domain name you’ve set up. Mine is *grafana.rishab.cloud*

```
server {
    listen 80;
    listen [::]:80;
    server_name  YOUR-DOMAIN-NAME;

    location / {
        proxy_pass           http://localhost:3000/;
    }
}
```

Save and restart Nginx:
```
sudo service nginx restart
sudo service nginx status
```

Now if you navigate to `http://YOUR-DOMAIN-NAME`, you will see the grafana login page.

![giphy.gif](https://cdn.hashnode.com/res/hashnode/image/upload/v1634230812100/N5DSDoP0d.gif)
