const { Telegraf, Markup, Scenes, session } = require('telegraf');
require('dotenv').config();

const { namazTime } = require('./prayCalc');
const constants = require('./const');
const bot = new Telegraf(process.env.BOT_TOKEN);

const SceneGenerator = require('./Scenes');
const curScene = new SceneGenerator();
const GreeterSchene = curScene.GenGreeterSchene;
const LocationSchene = curScene.GenLocationSchene;

let notifications = false;
let location;

bot.context.notifications = notifications;
bot.context.location = location;

//bot.use(Telegraf.log());

const stage = new Scenes.Stage([LocationSchene(), GreeterSchene()]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('greeter'));

bot.hears('⌛️ Время намаза на сегодня', async (ctx) => {
  console.log('first place', ctx.prayTime);
  const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = await ctx.prayTime.getTime();
  await ctx.replyWithHTML(
    `⌛️ Время намаза на ${date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${fajr} Фаджр\n🌅 ${sunrise} Восход\n🌇 ${dhuhr} Зухр\n🌆 ${asr} Аср\n🏙 ${maghrib} Магриб\n🌃 ${isha} Иша`,
  );
  if (notifications) {
    msgID += 2;
  }
});
bot.hears('🗺 Поменять расположение', (ctx) => ctx.scene.enter('location'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
