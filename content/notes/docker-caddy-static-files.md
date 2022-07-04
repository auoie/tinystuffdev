---
title: Using Caddy and Docker to Serve Static Files
created: Mon Jun 27 07:25:48 PM UTC 2022
description: Using the caddy docker image makes it easy to serve static files.
---

## Docker and `ufw`

Before using Docker, I think it's worthwhile to consider how it works with a normal firewall.
Otherwise, you might end up [exposing data](https://news.ycombinator.com/item?id=27613217) unintentionally.
I'm mostly motivated to look into this based on [this Hacker News post](https://news.ycombinator.com/item?id=31839936).
First, let's setup a firewall.
I didn't have one before, which might have been a bad idea.
The following commands are taken from [here](https://wiki.archlinux.org/title/Uncomplicated_Firewall).

```bash
paru -S ufw
sudo ufw default deny
sudo ufw limit ssh
sudo ufw enable
sudo systemctl start ufw
sudo systemctl enable ufw
```

Making docker work with a firewall is not obvious.
Apparently, Docker punches performs port punching through a firewall.
For example, suppose we have two devices on a LAN.
This example demonstrates Docker port punching.

```bash
# victim@192.168.4.103
sudo docker run --name sensitive_data -e POSTGRES_PASSWORD=password -p 5432:5432 postgres

# attacker@192.169.4.20
nmap -p 5432 -Pn --open 192.168.4.0/24 --verbose
# shows 5432/tcp open on 172.168.4.103
pip3 install pgcli
python3 -m pgcli postgresql://postgres:password@192.168.4.0:5432
```

The following example shows how binding to the loopback address still exposes the port.
This is taken from [this issue comment](https://github.com/moby/moby/issues/22054#issuecomment-962202433).
Suppose we have two devices on a LAN.
This example shows that even if you use `127.0.0.1`, the port will be accessible over LAN.
This is not explicitly stated in [the docs](https://docs.docker.com/engine/reference/commandline/run/#publish-or-expose-port--p---expose).

```bash
# victim@192.168.4.103
sudo docker run --name sensitive_data -e POSTGRES_PASSWORD=password -p 127.0.0.1:5432:5432 postgres

# attacker@192.169.4.20
ip route add 172.16.0.0/12 via 192.168.0.103
nmap -p 5432 -Pn --open 172.17.0.0/24 --verbose
# shows 5432/tcp open on 172.17.0.3
pip3 install pgcli
python3 -m pgcli postgresql://postgres:password@172.17.0.3:5432
```

See [this post](https://news.ycombinator.com/item?id=27615346) for suggestions on how to setup a secure database.
Basically, setup a VPC and limit external connections.

For convience, I'm going to enable LAN access.
Be wary of the fact that if you're using a public wifi connection, your ports will be exposed.

```bash
sudo ufw allow from 192.168.4.0/24 # allow LAN access
```

## CIDR

Note that CIDR (classless inter-domain routing) is just notation for specificying a range of IP addresses.
See [this helpful visualization](https://news.ycombinator.com/item?id=10730756).
The range CIDR x1.x2.x3.x4/y must satisfy `0 <= x1, x2, x3, x4 <= 255` with `0 <= y <= 32`.
The value `y` is the number of fixed bits from the left.
This is the prefix length.
For example, `172.16.0.0/12` is the range `172.16.0.0` to `172.31.255.255`.
In IPv4, there are 32 bits in an address.
So a CIDR block with a prefix length of `y` has `2^(32 - y)` addresses.

## Setting Up Rootless Docker

Typically, docker is run as root.
For convenience , you might be tempted to setup docker so that you don't need to use `sudo` to run it.
This is equivalent to giving users root permissions.
Alternatively, setup [rootless docker](https://docs.docker.com/engine/security/rootless/).
Then you'll be able to run docker without needing to use `sudo` and without giving a user root permissions.
An added benefit is that rootless docker doesn't perform port punching.
Note that docker and rootless docker are listening on different sockets.
Some applications automatically send messages on `unix:///var/run/docker.sock`,
which might not be what you want.
For example, I use `i3status-rust` to display some information about docker.
In order to get it to display information about rootless docker, I have to change the socket path to
`$XDG_RUNTIME_DIR/docker.sock`

```bash
sudo docker context inspect | jq ".[0].Endpoints.docker.Host"
# "unix:///var/run/docker.sock"

docker context inspect | jq ".[0].Endpoints.docker.Host"
# "unix:///run/user/1000/docker.sock"
```

## Setting Up a File Server on LAN

Caddy expects the default Caddyfile to be located at `/etc/caddy/Caddyfile`.
I want to serve `$HOME/Books` on my LAN.
I created a custom Caddyfile at `$HOME/Documents/docker/Caddyfile`.
It should be accessible at `{local-ip-address}:60000`.
This address can be found in the results of `ip a`.
Be careful about exposing certain folders.
Chrome extensions could potentially read the files exposed.

```bash
docker run -d \
	--restart always \
	-p 60000:80 \
	--name caddy-file-server \
	-v $HOME/Books:/mnt/app/Books:ro \
	-v $HOME/Documents/docker/caddy-file-server/Caddyfile:/etc/caddy/Caddyfile:ro \
	caddy
```

The Caddyfile looks like

```markup
:80 {
	# Set this path to your site's directory.
	root * /mnt/app

	# Enable the static file server.
	file_server {
		# enables file listings for directories
		browse

		# set list of index filesnames to empty
		index ""
	}
}
```

## Setting Up a File Server on a VPS

At the moment, I'm serving this website on a Digital Ocean droplet using a Caddy container as my file server.
For my DNS management, I'm using Cloudflare.
I'm using wildcard records for my names.
In order to make that work, I need to use the Caddy module https://github.com/caddy-dns/cloudflare.

If you want, you can make a docker image with the following Dockerfile:

```docker
FROM caddy:2.5.1-builder AS builder
RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare
FROM caddy:2.5.1
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
```

I'm just using an image that someone else made: https://hub.docker.com/r/slothcroissant/caddy-cloudflaredns.

```bash
# This creates a network that gives the caddy droplet access to other containers on the network
sudo docker network create caddy-server

# This runs the caddy server
sudo docker run -d \
--network caddy-server \
--restart always \
-p 80:80 \
-p 443:443 \
--name caddy-server \
-e CLOUDFLARE_API_TOKEN=your_api_token \
-v $HOME/Documents:/mnt/apps:ro \
-v $HOME/docker/caddy/Caddyfile:/etc/caddy/Caddyfile:ro \
slothcroissant/caddy-cloudflaredns
```

If you don't want your API token to be saved in your bash history, just [add a space](https://stackoverflow.com/questions/6475524/how-do-i-prevent-commands-from-showing-up-in-bash-history) before the command.
A minimal version of my Caddyfile looks like this:

```markup
tinystuff.dev {
	root * /mnt/apps/tinystuffdev
	file_server
	handle_errors {
		@404 {
			expression {http.error.status_code} == 404
		}
		rewrite @404 /404/index.html
		file_server
	}
}

*.tinystuff.dev {
	respond 404
	tls {
		dns cloudflare {env.CLOUDFLARE_API_TOKEN}
	}
}
```

I used to have the line `try_files {path}.html {path}`
within my `tinystuff.dev` file server block as shown [here](https://caddyserver.com/docs/v2-upgrade#ext),
but that messed with OpenGraph fetching my webpages.
Thus, I'm just going to keep the defaults.
