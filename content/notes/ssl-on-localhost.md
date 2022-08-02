---
title: SSL for Local Development
created: Tue Aug  2 01:15:23 AM UTC 2022
description:
  To setup SSL on localhost, use mkcert to generate the local HTTPS certificates.
  The run Caddy in Docker, pointing it to the generated certificates and using it as a reverse proxy
  pointing to the development server.
---

I was testing WebSockets.
I wanted to use the `wss` protocol, which requires HTTPS.
This post shows my solution for using HTTPS in local development.

## Frontend with Next.js and TypeScript

We can create the frontend with
`npx create-next-app@latest --ts frontend`
I like TypeScript and prefer using it for most projects.
Then we can enter the project and run the development server on
port `3000` with `yarn dev`.
You should be able to set the web page at `localhost:3000`.

## Backend Server with Go

We can create a folder for a backend with `mkdir backend`
and create a Go module with `go mod init api`.
Then we can get the help of the Go web framework [gin](https://github.com/gin-gonic/gin) with `go get -u github.com/gin-gonic/gin`.
Then we have a basic server in a file `main.go`.
We can use the command `PORT=3001 go run .` to run it.
You can see a text response `hello` at `localhost:3001`.

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port, ok := os.LookupEnv("PORT")
	if !ok {
		log.Fatal("PORT not found")
	}
	r := gin.Default()
	r.GET("/", func(ctx *gin.Context) {
		ctx.String(http.StatusOK, "hello")
	})
	r.Run(fmt.Sprint(":", port))
}
```

## Certificates with `mkcert`

Then we can create the certificates with [`mkcert`](https://github.com/FiloSottile/mkcert).
The way you install it depends on your operating system.
I use `paru` on Arch Linux, so I ran `paru -S mkcert`.
To set it up, we run `mkcert -install`.
Then we can run `mkdir ~/certs` to create a folder for the certificates.
Then run
`mkcert -cert-file ~/certs/cert.pem -key-file ~/certs/key.pem localhost 127.0.0.1 ::1`
to create the certificates.

## HTTPS with Caddy

Then we can use the [Caddy web server](https://caddyserver.com/) to enable HTTPS.
We can create a `Caddyfile` with `mkdir server` and `touch ./server/Caddyfile`.
It looks like

```markup
:3002 {
  tls /mnt/cert.pem /mnt/key.pem
  handle_path /api/* {
    reverse_proxy localhost:3001
  }
  reverse_proxy localhost:3000
}
```

Then we can run Caddy within Docker so that we don't have to install it locally.

```bash
docker run --rm -it \
  --network host \
  --name server \
  -v $PWD/server/Caddyfile:/etc/caddy/Caddyfile:ro \
  -v $HOME/certs/:/mnt/:ro \
  caddy
```

Now `https` should work.
Running `curl https://localhost:3002` returns the Next.js development website.
Running `curl https://localhost:3002/api/` returns the response of the Go web server.
Going to `https://localhost:3002` in Chrome shows the lock next to the website, showing that SSL and HTTPS is working.

Running `tree -L 2` shows the final project structure.

```markup
├── backend
│   ├── go.mod
│   ├── go.sum
│   └── main.go
├── frontend
│   ├── next.config.js
│   ├── next-env.d.ts
│   ├── node_modules
│   ├── package.json
│   ├── pages
│   ├── public
│   ├── README.md
│   ├── styles
│   ├── tsconfig.json
│   └── yarn.lock
└── server
    └── Caddyfile
```
