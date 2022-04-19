const { Markup, Scenes } = require('telegraf');

const { enter, leave } = Scenes.Stage;

const constants = require('./const');
const { namazTime } = require('./prayCalc');

class SceneGenerator {
  GenGreeterSchene() {
    const greeterScene = new Scenes.BaseScene('greeter');
    greeterScene.enter((ctx) =>
      ctx.reply(
        `Привет ${ctx.message.from.first_name}!\nЯ твой персональный помошник\nВыбери пожалуста свое расположение 👇`,
        Markup.inlineKeyboard([[Markup.button.callback('Бисмиллях', 'choose_location')]]),
      ),
    );
    greeterScene.leave((ctx) => ctx.reply('Bye'));
    greeterScene.action('choose_location', (ctx) => {
      ctx.answerCbQuery();
      enter('location');
    });

    return greeterScene;
  }
  GenLocationSchene() {
    const locationScene = new Scenes.BaseScene('location');
    locationScene.enter((ctx) =>
      ctx.reply(
        '🗺 Выберите свое расположение\n⚠️Если вашего расположения нет нажмите на выбрать с помощью геопозици',
        Markup.inlineKeyboard([
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
        ]),
      ),
    );
    locationScene.leave((ctx) => ctx.reply('Bye'));

    for (let index = 1; index < 14; index++) {
      locationScene.action(`location_${index}`, (ctx) => {
        ctx.answerCbQuery();
        locationSceneAction(ctx, locationScene);
      });
    }
    return locationScene;
  }
}
function locationSceneAction(ctx, scene) {
  scene.leave();
  location = constants[`${ctx.match[0]}`];
  ctx.prayTime = new namazTime(location);
  console.log('Second place', ctx.prayTime);
  ctx.reply(
    'Расположение изменено',
    Markup.keyboard([
      ['⌛️ Время намаза на сегодня'],
      ['🗺 Поменять расположение'],
      ['🔔 Включить уведомления', '🔕 Выключить уведомления'],
    ]),
  );
}
module.exports = SceneGenerator;
