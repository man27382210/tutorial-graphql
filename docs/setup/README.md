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

## Run dev server

```bash
$ ./pm2 start pm2_app.json
```

starwars-normal on 3000
starwars-apollo on 3001
starwars-relay on 3002
swapi-graphql on 5000

## PM2 operation

> see all server status

```bash
$ ./pm2 ls
```

> stop all

```bash
$ ./pm2 stop all
```

> delete all

```bash
$ ./pm2 delete all
```