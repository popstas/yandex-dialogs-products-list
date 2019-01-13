const help = require('../help');

// команда по умолчанию (справка)
module.exports = {
  intent: '',
  matcher: ['', 'привет', 'приветствие'],

  async handler(ctx) {
    if (ctx.message != 'ping') ctx.logMessage(`> ${ctx.message} (welcome)`);
    let msg;
    const buttons = ['помощь', 'примеры', 'что ты знаешь', 'команды', 'что нового'];
    if (ctx.user.state.visitor.visits > 1 || ctx.user.state.visit.messages > 1) {
      msg =
        'Привет' +
        (ctx.user.state.visitor.lastVisitLong
          ? ', давно не виделись, спросите "что нового", чтобы узнать об обновлениях'
          : '');
      return ctx.reply(msg, buttons);
    } else {
      msg = [
        'Я умею запоминать продукты в холодильнике и их срок годности.',
        'Скажите "примеры", чтобы узнать, как можно добавлять продукты'
      ];
      return ctx.confirm(msg, help.tour.handler, help.first.handler);
    }
  }
};
