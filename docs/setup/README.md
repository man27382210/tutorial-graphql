# Installation

> Clone this repos to your local

```bash
$ git clone https://github.com/man27382210/tutorial-graphql.git
```

> Install node packages

```bash
$ chmod 700 install.sh
$ ./install.sh
```

## Run GraphQL server

```bash
$ ./pm2 start pm2_app.json
```
graphQL-server on 4000

```bash
$ ./pm2 start ./query/pm2_app.json
```
query-basic on 3001
query-apollo on 3002
query-relay on 3003

## PM2 operation

> see all server status

```bash
$ ./pm2 list
```

> stop all

```bash
$ ./pm2 stop all
```

> delete all

```bash
$ ./pm2 delete all
```