const { Telegraf, Markup } = require('telegraf');
const { namazTime } = require('./prayCalc');
const constants = require('./const');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let prayTime = new namazTime();
let notifications = false;
let loc,
  msgID = 0;

bot.start((ctx) =>
  ctx.replyWithHTML(
    `Привет ${ctx.message.from.first_name}!\nЯ твой персональный помошник\nВыбери пожалуста свое расположение 👇`,
    Markup.inlineKeyboard([[Markup.button.callback('Бисмиллях', 'choose_location')]]),
  ),
);
bot.on('message', () => {
  if (notifications) {
    msgID++;
  }
});
bot.action(
  'choose_location',
  async (ctx) => (
    await ctx.answerCbQuery(),
    await ctx.replyWithHTML(
      '🗺 Выберите свое расположение\n⚠️Если вашего расположения нет нажмите на выбрать с помощью геопозици',
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
        (prayTime = new namazTime(loc)),
      )
    ),
  );
}
function addCustomLocation({ latitude, longitude }) {
  prayTime = new namazTime([latitude, longitude]);
}
for (let index = 1; index < 14; index++) {
  locationAction(`location_${index}`);
}
try {
  bot.hears('⌛️ Время намаза на сегодня', async (ctx) => {
    const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = prayTime.getTime();
    await ctx.replyWithHTML(
      `⌛️ Время намаза на ${date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${fajr} Фаджр\n🌅 ${sunrise} Восход\n🌇 ${dhuhr} Зухр\n🌆 ${asr} Аср\n🏙 ${maghrib} Магриб\n🌃 ${isha} Иша`,
    );
    if (notifications) {
      msgID += 2;
    }
  });
} catch (error) {
  console.log(error);
}

bot.hears(
  '🗺 Поменять расположение',
  async (ctx) =>
    await ctx.replyWithHTML(
      '🗺 Отправьте мне свою геопозицию',
      Markup.inlineKeyboard(constants.inlineButtons),
    ),
);

function sendNextTime(ctx) {
  ctx.replyWithHTML(prayTime.isNextTime(true).textMessage);
  let msg_id = ctx.update.message.message_id + 2;
  const changesInMinute = setInterval(() => {
    if (!notifications) {
      clearInterval(changesInMinute);
    } else if (prayTime.isNextTime().isChanged) {
      ctx.deleteMessage(msg_id++);
      ctx.replyWithHTML(prayTime.isNextTime().textMessage, { disable_notification: true });
    } else {
      const { isChanged, textMessage } = prayTime.isNextTime();
      if (isChanged) {
        ctx.deleteMessage(msg_id++);
        ctx.replyWithHTML(textMessage, { disable_notification: true });
      }
    }
  }, 30000);
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
  try {
    await ctx.answerCbQuery(),
      await ctx.replyWithHTML('Введите ваше расположение'),
      bot.on('message', (ctx) => {
        console.log(ctx.message);
        if (ctx.message.location) {
          addCustomLocation(ctx.message.location);
          ctx.replyWithHTML(
            'Расположение изменено',
            Markup.keyboard([
              ['⌛️ Время намаза на сегодня'],
              ['🗺 Поменять расположение'],
              ['🔔 Включить уведомления', '🔕 Выключить уведомления'],
            ]),
          );
        }
      });
  } catch (e) {
    console.log(e);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
