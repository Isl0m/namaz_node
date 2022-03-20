const { Composer } = require('telegraf');
const { Markup } = require('telegraf');

const bot = new Composer();

bot.hears('⌛️ Время намаза на сегодня', async (ctx) => {
  const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = ctx.prayTime.getTime();

  await ctx.replyWithHTML(
    `⌛️ Время намаза на ${date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${fajr} Фаджр\n🌅 ${sunrise} Восход\n🌇 ${dhuhr} Зухр\n🌆 ${asr} Аср\n🏙 ${maghrib} Магриб\n🌃 ${isha} Иша`,
  );
});
bot.hears(
  '🗺 Поменять расположение',
  async (ctx) =>
    await ctx.replyWithHTML(
      'Отправьте мне свою геопозицию',
      Markup.inlineKeyboard(ctx.inlineButtons),
    ),
);
bot.hears(
  '🔔 Включить уведомления',
  async (ctx) => (
    await ctx.replyWithHTML('Уведомления включены'),
    (ctx.notifications = true),
    ctx.notifications ? ctx.sendNextTime(ctx) : ''
  ),
);
bot.hears(
  '🔕 Выключить уведомления',
  async (ctx) => (await ctx.replyWithHTML('Уведомления отключены'), (ctx.notifications = false)),
);

module.exports = bot;
