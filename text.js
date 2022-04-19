const { Telegraf, Markup, Scenes, session } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const SceneGenerator = require('./Scenes');
const curScene = new SceneGenerator();
const GreeterSchene = curScene.GenGreeterSchene;
const LocationSchene = curScene.GenLocationSchene;
let prayTime = curScene.getTime;

bot.context.notifications = false;
bot.context.location;

//bot.use(Telegraf.log());

const stage = new Scenes.Stage([LocationSchene(), GreeterSchene()]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('greeter'));

bot.hears('⌛️ Время намаза на сегодня', async (ctx) => {
  console.log('first place', prayTime);
  const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = await prayTime.getTime();
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
