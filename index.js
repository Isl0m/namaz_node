const { Telegraf, Markup } = require('telegraf');
const pray = require('./prayCalc');
const constants = require('./const');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

let prayTime = pray.time(['41.311081', '69.240562']);
let notifications = false;
let loc;

bot.start((ctx) =>
  ctx.replyWithHTML(
    `Привет ${ctx.message.from.first_name}!\nЯ твой персональный помошник Билял\nВыбери пожалуста свое расположение 👇`,
    Markup.inlineKeyboard([[Markup.button.callback('Бисмиллях', 'choose_location')]]),
  ),
);
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.action(
  'choose_location',
  async (ctx) => (
    await ctx.answerCbQuery(),
    await ctx.replyWithHTML(
      '🗺 Выбери свое расположение',
      Markup.inlineKeyboard(constants.inlineButtons),
    )
  ),
);

function locationAction(location_btn) {
  bot.action(
    location_btn,
    async (ctx) => (
      await ctx.answerCbQuery(),
      await ctx.replyWithHTML(
        'Расположение изменено',
        Markup.keyboard([
          ['⌛️ Время намаза на сегодня'],
          ['🗺 Поменять расположение'],
          ['🔔 Включить уведомления', '🔕 Выключить уведомления'],
        ]),

        (loc = constants[`${ctx.match[0]}`]),
        (prayTime = pray.time(loc)),
      )
    ),
  );
}
function addCustomLocation({ latitude, longitude }) {
  prayTime = pray.time([latitude, longitude]);
}
for (let index = 1; index < 14; index++) {
  locationAction(`location_${index}`);
}

bot.hears(
  '⌛️ Время намаза на сегодня',
  async (ctx) =>
    await ctx.replyWithHTML(
      `⌛️ Время намаза на ${prayTime.date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${prayTime.fajr} Фаджр\n🌅 ${prayTime.sunrise} Восход\n🌇 ${prayTime.dhuhr} Зухр\n🌆 ${prayTime.asr} Аср\n🏙 ${prayTime.maghrib} Магриб\n🌃 ${prayTime.isha} Иша`,
    ),
);

bot.hears(
  '🗺 Поменять расположение',
  async (ctx) =>
    await ctx.replyWithHTML(
      '🗺 Выбери свое расположение',
      Markup.inlineKeyboard(constants.inlineButtons),
    ),
);

function sendNextTime(ctx) {
  ctx.replyWithHTML(`Следующий намаз ${pray.nextTime(['41.311081', '69.240562'])}`);
  let msg_id = ctx.update.message.message_id + 2;
  const changesInMinute = setInterval(() => {
    if (!notifications) {
      clearInterval(changesInMinute);
    } else {
      console.log('event');
      console.log(ctx);
      ctx.deleteMessage(msg_id++);
      ctx.replyWithHTML(`Следующий намаз ${pray.nextTime(['41.311081', '69.240562'])}`);
    }
  }, 60000);
}
bot.hears(
  '🔔 Включить уведомления',
  async (ctx) => (
    await ctx.replyWithHTML('Уведомления включены'),
    (notifications = true),
    notifications ? sendNextTime(ctx) : ''
  ),
);
bot.hears(
  '🔕 Выключить уведомления',
  async (ctx) => (await ctx.replyWithHTML('Уведомления отключены'), (notifications = false)),
);
bot.action('custom_location', async (ctx) => {
  ctx.replyWithHTML('Введите ваше расположение');
  bot.on('message', (ctx) => {
    if (ctx.message.location) {
      addCustomLocation(ctx.message.location);
      ctx.replyWithHTML('Расположение изменено');
    }
  });
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
