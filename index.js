const { Telegraf, Markup } = require('telegraf');
const { namazTime } = require('./prayCalc');
const constants = require('./const');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let prayTime = new namazTime();
let notifications = false;
let location;

bot.context.location = location;
bot.context.notifications = notifications;
bot.context.prayTime = prayTime;
bot.context.sendNextTime = constants.sendNextTime;
bot.context.inlineButtons = constants.inlineButtons;
bot.use(require('./composers/hears'));
bot.use(require('./composers/actions'));

bot.start((ctx) => {
  ctx.replyWithHTML(
    `Привет ${ctx.message.from.first_name}!\nЯ твой персональный помошник\nВыбери пожалуста свое расположение 👇`,
    Markup.inlineKeyboard([[Markup.button.callback('Бисмиллях', 'choose_location')]]),
  );
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
