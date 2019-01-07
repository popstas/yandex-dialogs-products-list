# Сборка yandex-dialogs-sdk из master
В package.json:
```
    "yandex-dialogs-sdk": "fletcherist/yandex-dialogs-sdk"
```

В терминале:
```
cd node_modules/ && git clone https://github.com/fletcherist/yandex-dialogs-sdk.git && cd yandex-dialogs-sdk && npm i && npm run test && npm run build && run run dev
```

## Разворачивание с mongodb
1. Раскомментировать в docker-compose.yml сервис "mongo", задать логин и пароль в файле .env (скорировать из .env.sample)
2. docker-compose up -d
3. Зайти в монгу: `docker-compose exec mongo bash`
4. Зайти в mongo shell, залогиниться админом:  и создать юзера в монге:
```
mongo --port 27017
# in mongo shell
db.auth({user: 'yandex-dialogs-products-list', pwd: 'mypassword'})
use yandex-dialogs-products-list
db.createUser({ user: 'yandex-dialogs-products-list', pwd: 'mypassword', roles: [ { role: 'readWrite', db: 'yandex-dialogs-products-list' } ] })
```
