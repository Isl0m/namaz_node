const { Telegraf,Markup } = require('telegraf')
const pray = require('./prayCalc')
const location = require('./const')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)

let prayTime = pray.time(['41.311081','69.240562']);
let notifications = false;
let loc;

bot.start((ctx) => ctx.replyWithHTML(`Привет ${ctx.message.from.first_name}!\nЯ твой персональный помошник Билял\nВыбери пожалуста свое расположение 👇`,Markup.inlineKeyboard(
    [
      [Markup.button.callback('Бисмиллях', 'choose_location')]
    ]
  )))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.action('choose_location', async (ctx) => (
    await ctx.answerCbQuery(),
    await ctx.replyWithHTML('🗺 Выбери свое расположение',Markup.inlineKeyboard(
        [
            [Markup.button.callback('Ташкент', 'location_1'),Markup.button.callback('Каракалпакстан', 'location_2'),Markup.button.callback('Андижан', 'location_3')],
            [Markup.button.callback('Бухара', 'location_4'),Markup.button.callback('Джизак', 'location_5'),Markup.button.callback('Кашкадарья', 'location_6')],
            [Markup.button.callback('Навои', 'location_7'),Markup.button.callback('Наманган', 'location_8'),Markup.button.callback('Самарканд', 'location_9')],
            [Markup.button.callback('Сурхандарья', 'location_10'),Markup.button.callback('Сырдарья', 'location_11'),Markup.button.callback('Фергана', 'location_12')],
            [Markup.button.callback('Хорезм', 'location_13')],
        ]
      )))
)

function locationAction(location_btn) {
    bot.action(location_btn, async (ctx) =>( await ctx.answerCbQuery(), await ctx.replyWithHTML('Расположение изменено', Markup.keyboard(
        [
            ['⌛️ Время намаза на сегодня','🗺 Поменять расположение'],
            ['🔔 Включить уведомления']
        ]
    ),
    
        loc = location[`${ctx.match[0]}`],
    
        prayTime = pray.time(loc),
        
    )))
}

locationAction('location_1')
locationAction('location_2')
locationAction('location_3')
locationAction('location_4')
locationAction('location_5')
locationAction('location_6')
locationAction('location_7')
locationAction('location_8')
locationAction('location_9')
locationAction('location_10')
locationAction('location_11')
locationAction('location_12')
locationAction('location_13')


bot.hears('⌛️ Время намаза на сегодня', async (ctx)=> await ctx.replyWithHTML(
    `⌛️ Время намаза на ${prayTime.date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${prayTime.fajr} Фаджр\n🌅 ${prayTime.sunrise} Восход\n🌇 ${prayTime.dhuhr} Зухр\n🌆 ${prayTime.asr} Аср\n🏙 ${prayTime.maghrib} Магриб\n🌃 ${prayTime.isha} Иша`
))

bot.hears('🗺 Поменять расположение', async (ctx)=> (
await ctx.replyWithHTML('🗺 Выбери свое расположение',Markup.inlineKeyboard(
    [
        [Markup.button.callback('Ташкент', 'location_1'),Markup.button.callback('Каракалпакстан', 'location_2'),Markup.button.callback('Андижан', 'location_3')],
        [Markup.button.callback('Бухара', 'location_4'),Markup.button.callback('Джизак', 'location_5'),Markup.button.callback('Кашкадарья', 'location_6')],
        [Markup.button.callback('Навои', 'location_7'),Markup.button.callback('Наманган', 'location_8'),Markup.button.callback('Самарканд', 'location_9')],
        [Markup.button.callback('Сурхандарья', 'location_10'),Markup.button.callback('Сырдарья', 'location_11'),Markup.button.callback('Фергана', 'location_12')],
        [Markup.button.callback('Хорезм', 'location_13')],
    ]
  ))
  )
)
bot.hears('🔔 Включить уведомления', async (ctx)=> (await ctx.replyWithHTML(
    `${notifications? 'Уведомления отключены':'Уведомления включены'}`
),notifications = !notifications,notifications ? sendNextTime(ctx):"" ))

function sendNextTime(ctx) {
    ctx.replyWithHTML(`Следующий намаз через ${pray.nextTime(['41.311081','69.240562'])}`)
    let msg_id = ctx.update.message.message_id + 2
    setInterval(() => {
        ctx.deleteMessage(msg_id++ );
        ctx.replyWithHTML(`Следующий намаз через ${pray.nextTime(['41.311081','69.240562'])}`)
    }, 60000);
}

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))