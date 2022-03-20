const { Composer } = require('telegraf');
const { Markup } = require('telegraf');

const bot = new Composer();

function sendNextTime(ctx) {
  ctx.replyWithHTML(ctx.prayTime.isNextTime(true).textMessage);

  ctx.msgID = ctx.update.message.message_id + 2;

  const changesInMinute = setInterval(() => {
    if (!ctx.notifications) {
      clearInterval(changesInMinute);
    } else {
      const { isChanged, textMessage } = ctx.prayTime.isNextTime();
      if (isChanged) {
        ctx.deleteMessage(ctx.msgID++);
        ctx.replyWithHTML(textMessage, { disable_notification: true });
      }
    }
  }, 30000);
}

bot.hears('⌛️ Время намаза на сегодня', async (ctx) => {
  const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = ctx.prayTime.getTime();

  await ctx.replyWithHTML(
    `⌛️ Время намаза на ${date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${fajr} Фаджр\n🌅 ${sunrise} Восход\n🌇 ${dhuhr} Зухр\n🌆 ${asr} Аср\n🏙 ${maghrib} Магриб\n🌃 ${isha} Иша`,
  );
  if (ctx.notifications) {
    ctx.msgID += 2;
  }
});
bot.hears(
  '🗺 Поменять расположение',
  async (ctx) =>
    await ctx.replyWithHTML(
      'Отправьте мне свою геопозицию',
      Markup.inlineKeyboard(ctx.inlineButtons),

      (ctx.notifications = false),
    ),
);
bot.hears(
  '🔔 Включить уведомления',
  async (ctx) => (
    await ctx.replyWithHTML('Уведомления включены'),
    (ctx.notifications = true),
    ctx.notifications ? sendNextTime(ctx) : ''
  ),
);
bot.hears(
  '🔕 Выключить уведомления',
  async (ctx) => (await ctx.replyWithHTML('Уведомления отключены'), (ctx.notifications = false)),
);
bot.on('message', (ctx) => {
  if (ctx.notifications) {
    ctx.msgID++;
  }
});

module.exports = bot;
