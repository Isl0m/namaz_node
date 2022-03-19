const { Markup } = require('telegraf');

const location_1 = ['41.311081', '69.240562'];
const location_2 = ['44.21636', '58.82986'];
const location_3 = ['40,7821', '72,3442 '];
const location_4 = ['39,7747', '64,4286'];
const location_5 = ['40.11583', '67.84222'];
const location_6 = ['38.86056', '65.78905'];
const location_7 = ['40.10392', '65.36883'];
const location_8 = ['40,9983', '71,6726'];
const location_9 = ['39.65417', '66.95972'];
const location_10 = ['37.9409005', '67.5708536'];
const location_11 = ['40.8372509', '68.6618407'];
const location_12 = ['40.37338', '71.79783'];
const location_13 = ['41.55', '60.63333'];

const differentLanguage = {
  ru: {
    start: (text) =>
      `Привет ${text}!\nЯ твой персональный помошник\nВыбери пожалуста свое расположение 👇`,
    startAction: [Markup.button.callback('Бисмиллях', 'choose_location')],
    chooseLocation:
      '🗺 Выберите свое расположение\n⚠️Если вашего расположения нет нажмите на выбрать с помощью геопозици',
    locationChanged: 'Расположения изменено',
    inlineButtons: [
      [Markup.button.callback('С помощью геолокации ', 'custom_location')],
      [
        Markup.button.callback('Ташкент', 'location_1'),
        Markup.button.callback('Андижан', 'location_3'),
        Markup.button.callback('Бухара', 'location_4'),
      ],
      [
        Markup.button.callback('Джизак', 'location_5'),
        Markup.button.callback('Кашкадарья', 'location_6'),
        Markup.button.callback('Навои', 'location_7'),
      ],
      [
        Markup.button.callback('Наманган', 'location_8'),
        Markup.button.callback('Самарканд', 'location_9'),
        Markup.button.callback('Сурхандарья', 'location_10'),
      ],
      [
        Markup.button.callback('Сырдарья', 'location_11'),
        Markup.button.callback('Фергана', 'location_12'),
        Markup.button.callback('Хорезм', 'location_13'),
      ],
      [Markup.button.callback('Каракалпакстан', 'location_2')],
    ],
    keyboard: [
      ['⌛️ Время намаза на сегодня'],
      ['🗺 Поменять расположение'],
      ['🔔 Включить уведомления', '🔕 Выключить уведомления'],
    ],
    notification: ['🔔 Включить уведомления', '🔕 Выключить уведомления'],
    todayNamazTime: (date, fajr, sunrise, dhuhr, asr, maghrib, isha) =>
      `⌛️ Время намаза на ${date}\n🗺 Ташкент|Узбекистан\n\n🌄 ${fajr} Фаджр\n🌅 ${sunrise} Восход\n🌇 ${dhuhr} Зухр\n🌆 ${asr} Аср\n🏙 ${maghrib} Магриб\n🌃 ${isha} Иша`,
    changeByLocation: 'Отправьте мне свою геопозицию',
  },
  uz: {
    start: (text) =>
      `Assalom aleykum ${text}!\nMen sizni personal yordamchizman\nOzizni manzilingizni tanglang 👇`,
    startAction: [Markup.button.callback('Bismillah', 'choose_location')],
    chooseLocation:
      "🗺 Ozizni manzilingizni tanglang\n⚠️Agar sizni manziliz yoq bo'lsa joylashuv boyicha tanglash ni bosing",
    locationChanged: "Manzilingil o'zgartirildi",
    inlineButtons: [
      [Markup.button.callback('Joylashuv boyicha ', 'custom_location')],
      [
        Markup.button.callback('Toshkent', 'location_1'),
        Markup.button.callback('Andijon', 'location_3'),
        Markup.button.callback('Buhoro', 'location_4'),
      ],
      [
        Markup.button.callback('Jizak', 'location_5'),
        Markup.button.callback('Qashqadaryo', 'location_6'),
        Markup.button.callback('Navoi', 'location_7'),
      ],
      [
        Markup.button.callback('Namangan', 'location_8'),
        Markup.button.callback('Samarqand', 'location_9'),
        Markup.button.callback('Surxondaryo', 'location_10'),
      ],
      [
        Markup.button.callback('Sirdaryo', 'location_11'),
        Markup.button.callback("Farg'ona", 'location_12'),
        Markup.button.callback('Xorazm', 'location_13'),
      ],
      [Markup.button.callback('Qoraqalpoqiston', 'location_2')],
    ],
    keyboard: [
      ['⌛️ Bugun namoz vaqtlari'],
      ["🗺 Manzilni o'zgartirish"],
      ['🔔 Eslatmani yoqish', "🔕 Eslatmani o'chirish"],
    ],
    todayNamazTime: (date, fajr, sunrise, dhuhr, asr, maghrib, isha) =>
      `⌛️ ${date} ga namoz vaqti\n🗺 Toshkent|O\'zbekiston\n\n🌄 ${fajr} Bomdod\n🌅 ${sunrise} Quyosh\n🌇 ${dhuhr} Peshin\n🌆 ${asr} Asr\n🏙 ${maghrib} Shom\n🌃 ${isha} Xufton`,
    changeByLocation: 'Manga geopozisiyani yuboring',
  },
};
const inlineButtons = [
  [Markup.button.callback('С помощью геолокации ', 'custom_location')],
  [
    Markup.button.callback('Ташкент', 'location_1'),
    Markup.button.callback('Андижан', 'location_3'),
    Markup.button.callback('Бухара', 'location_4'),
  ],
  [
    Markup.button.callback('Джизак', 'location_5'),
    Markup.button.callback('Кашкадарья', 'location_6'),
    Markup.button.callback('Навои', 'location_7'),
  ],
  [
    Markup.button.callback('Наманган', 'location_8'),
    Markup.button.callback('Самарканд', 'location_9'),
    Markup.button.callback('Сурхандарья', 'location_10'),
  ],
  [
    Markup.button.callback('Сырдарья', 'location_11'),
    Markup.button.callback('Фергана', 'location_12'),
    Markup.button.callback('Хорезм', 'location_13'),
  ],
  [Markup.button.callback('Каракалпакстан', 'location_2')],
];

function sendNextTime(ctx) {
  ctx.replyWithHTML(ctx.prayTime.isNextTime(true).textMessage);

  let msg_id = ctx.update.message.message_id + 2;
  const changesInMinute = setInterval(() => {
    if (!ctx.notifications) {
      clearInterval(changesInMinute);
    } else {
      const { isChanged, textMessage } = ctx.prayTime.isNextTime();
      if (isChanged) {
        ctx.deleteMessage(msg_id++);
        ctx.replyWithHTML(textMessage, { disable_notification: true });
      }
    }
  }, 30000);
}

module.exports.sendNextTime = sendNextTime;
module.exports.inlineButtons = inlineButtons;
module.exports.location_1 = location_1;
module.exports.location_2 = location_2;
module.exports.location_3 = location_3;
module.exports.location_4 = location_4;
module.exports.location_5 = location_5;
module.exports.location_6 = location_6;
module.exports.location_7 = location_7;
module.exports.location_8 = location_8;
module.exports.location_9 = location_9;
module.exports.location_10 = location_10;
module.exports.location_11 = location_11;
module.exports.location_12 = location_12;
module.exports.location_13 = location_13;
