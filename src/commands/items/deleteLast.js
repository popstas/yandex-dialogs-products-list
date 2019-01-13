const deleteQuestion = require('./deleteQuestion');

module.exports = {
  intent: 'deleteLast',
  matcher: /^(удали|удалить|забудь) ?(последнее|последний|последние|последнюю запись)?$/i,

  async handler(ctx) {
    if (!ctx.user.state.lastAddedItem) {
      ctx.chatbase.setNotHandled();
      return ctx.reply('Я ничего не запоминала в последнее время...');
    }
    const question = ctx.user.state.lastAddedItem.questions[0];
    return deleteQuestion.processDelete(ctx, question);
  }
};
