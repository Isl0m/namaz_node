# Создание телеграм бота на Telegraf.js

## Регистрация бота в Телеграм

- В Телеграме найти бота @BotFather
- Ввести команду /newbot
- Следуя подсказкам придумать название бота и логин для него
- Получить ссылку на нового бота и API токен
- Ввести команду /mybots
- Выбрать своего бота и нажать Edit Bot
- Добавить информацию description, about, botpic, commands

## Инициализация проекта

- Создать папку с названием проекта
- Открыть проект в своей IDE или редакторе
- Открыть терминал и перейти в папку с проектом
  > **ls, dir** посмотреть список каталогов  
  > **cd ..** перейти на уровень выше  
  > **cd каталог** перейти в каталог
- проверить версию node.js если нет версии, то установить [node.js](https://nodejs.org/en/)
  > **node -v** проверить версию
- инициализировать проект (создать файл package.json)
  > **npm init -y**
- установить [nodemon](https://www.npmjs.com/package/nodemon)
  > **npm i -D nodemon**
- установить [telegraf](https://www.npmjs.com/package/telegraf)
  > **npm i telegraf**
- установить [dotenv](https://www.npmjs.com/package/dotenv)
  > **npm i dotenv**
- Создать **файл .env** и записать в него:
  > BOT_TOKEN = Токен из @BotFather
- Создать **файл index.js** и записать в него:
  > const { Telegraf, Markup } = require("telegraf")  
  > require("dotenv").config()  
  > const bot = new Telegraf(process.env.BOT_TOKEN)  
  > bot.start((ctx) => ctx.reply('Welcome'))  
  > bot.help((ctx) => ctx.reply('Send me a sticker'))  
  > bot.on('sticker', (ctx) => ctx.reply('Like'))  
  > bot.hears('hi', (ctx) => ctx.reply('Hey there'))  
  > bot.launch()  
  > process.once('SIGINT', () => bot.stop('SIGINT'))  
  > process.once('SIGTERM', () => bot.stop('SIGTERM'))
- Создать **файл .gitignore**
  > /node_modules  
  > .env  
  > package-lock.json
- Создать **файл Procfile**
  > worker: npm start
- Изменить скрипты в файле **package.json**
  > "scripts": {  
  >  "start": "node index.js",  
  >  "dev": "nodemon index.js"  
  > },
- Запустить проект командой
  > npm run dev

## Деплой проекта на Heroku

- Зарегистрироваться на [GitHub](https://github.com/) и войти
- Создать репозиторий и запушить код бота
- Зарегистрироваться на [Heroku](https://www.heroku.com/) и войти
- Создать новое приложение  
  ![new/create new app](./img/deploy/create_new_app.jpg)
- Добавить константу с API токеном  
  ![settings/config vars](./img/deploy/token_heroku.jpg)
- Переключить Dyno с web на worker  
  ![resources](./img/deploy/resources.jpg)
- На вкладке Deploy связать проект с репозиторием GitHub  
  ![deploy](./img/deploy/deploy.jpg)
- Включить Automatic deploys (опционально)
- Запусть Manual Deploy
- Перезагрузить все Dyno  
  ![more/restart all dynos](./img/deploy/restart.jpg)
- Просматривать логи  
  ![more/view logs](./img/deploy/logs.jpg)
