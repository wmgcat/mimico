# mimico
Telegram-bot for send welcome-message on channel's posts
## Install, Run & Build
Install:
```sh
npm i
```
Run:
```sh
npm run start
```
Run develop:
```sh
npm run dev
```
Build:
```sh
docker build -t <image name> .
```

## .env
```
TOKEN=<Bot token>
CLEAR_TIMEOUT=15000 # 15 sec
```

## Paths
- Info for every messages: /src/info.txt
- Image for every message: /src/banner.png

###
![Stack](https://skillicons.dev/icons?i=ts,nodejs&perline=3)