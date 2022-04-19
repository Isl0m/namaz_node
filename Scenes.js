const { Markup, Scenes } = require('telegraf');

const constants = require('./const');
const { namazTime } = require('./prayCalc');
let prayTime = new namazTime();
class SceneGenerator {
  getTime() {
    return prayTime;
  }

  GenGreeterSchene() {
    const greeterScene = new Scenes.BaseScene('greeter');
    greeterScene.enter((ctx) =>
      ctx.reply(
        `Привет ${ctx.message.from.first_name}!\nЯ твой персональный помошник\nВыбери пожалуста свое расположение 👇`,
        Markup.inlineKeyboard([[Markup.button.callback('Бисмиллях', 'choose_location')]]),
      ),
    );
    greeterScene.action('choose_location', (ctx) => {
      ctx.answerCbQuery();
      ctx.scene.enter('location');
    });

    return greeterScene;
  }

  LocationSceneAction(ctx, scene) {
    scene.leave();
    const location = constants[`${ctx.match[0]}`];
    prayTime = new namazTime(location);
    ctx.reply(
      'Расположение изменено',
      Markup.keyboard([
        ['⌛️ Время намаза на сегодня'],
        ['🗺 Поменять расположение'],
        ['🔔 Включить уведомления', '🔕 Выключить уведомления'],
      ]),
    );
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
    console.log(this.LocationSceneAction);
    for (let index = 1; index < 14; index++) {
      locationScene.action(`location_${index}`, (ctx) => {
        ctx.answerCbQuery();
        this.LocationSceneAction(ctx, locationScene);
      });
    }
    return locationScene;
  }
}
module.exports = SceneGenerator;
