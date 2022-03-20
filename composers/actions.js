const { Composer } = require('telegraf');
const { Markup } = require('telegraf');

const { namazTime } = require('../prayCalc');
const constants = require('../const');

const bot = new Composer();

function addCustomLocation({ latitude, longitude }, ctx) {
  ctx.prayTime = new namazTime([latitude, longitude]);
}

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

        (ctx.location = constants[`${ctx.match[0]}`]),
        (ctx.prayTime = new namazTime(ctx.location)),
      )
    ),
  );
}

for (let index = 1; index < 14; index++) {
  locationAction(`location_${index}`);
}

bot.action(
  'choose_location',
  async (ctx) => (
    await ctx.answerCbQuery(),
    await ctx.replyWithHTML(
      '🗺 Выберите свое расположение\n⚠️Если вашего расположения нет нажмите на выбрать с помощью геопозици',
      Markup.inlineKeyboard(ctx.inlineButtons),
    )
  ),
);

bot.action('custom_location', async (ctx) => {
  ctx.replyWithHTML('Введите ваше расположение');
  bot.on('message', (ctx) => {
    if (ctx.message.location) {
      addCustomLocation(ctx.message.location, ctx);
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
});

module.exports = bot;
