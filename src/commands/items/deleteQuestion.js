const storage = require('../../storage');
const utils = require('../../utils');

// процесс удаления вопроса
const processDelete = async (ctx, question) => {
  ctx = await utils.resetState(ctx);

  let found = ctx.user.data.filter(item => {
    return item.questions.indexOf(question) != -1;
  });
  if (found.length == 0) {
    // ищем по "где"
    found = ctx.user.data.filter(item => {
      return item.answer.indexOf(question) != -1;
    });
    if (found.length === 1) {
      question = found[0].questions[0];
    }
  }

  // не нашлось
  if (found.length == 0) {
    ctx.user.state.deleteFails = (ctx.user.state.deleteFails | 0) + 1;
    // storage.setState(ctx.userData, ctx.user.state);
    // второй раз подряд не может удалить
    if (ctx.user.state.deleteFails > 1) {
      ctx.chatbase.setIntent('knownConfirm');
      return await ctx.confirm('Не знаю такого, рассказать, что знаю?', module.exports.known, ctx =>
        ctx.replyRandom(['ОК', 'Молчу', 'Я могу и всё забыть...'])
      );
    }
    return await ctx.replyRandom([`Я не знаю про ${question}`, `Что за ${question}?`]);
  }
  ctx.user.state.deleteFails = 0;
  // storage.setState(ctx.userData, ctx.user.state);

  // нашлось, но много
  if (found.length > 1) {
    console.log(found);
    return await ctx.reply('Я не уверена что удалять... Могу забыть всё');
  }

  const isSuccess = await storage.removeQuestion(ctx.userData, question);
  if (!isSuccess) {
    return ctx.reply('При удалении что-то пошло не так...');
  }

  // tour step 3
  if (ctx.user.state.tourStep === 'forget') {
    ctx.user.state.tourStep = '';
    // storage.setState(ctx.userData, ctx.user.state);
    return await ctx.reply(
      [
        'Прекрасно, теперь вы умеете пользоваться сценарием "список покупок".',
        'Чтобы узнать, как ещё можно использовать вторую память, скажите "примеры".',
        'Чтобы узнать обо всех командах, скажите "помощь".'
      ],
      ['примеры', 'помощь', 'первая помощь']
    );
  }

  return ctx.reply('Забыла, что ' + question);
};

module.exports = {
  intent: 'deleteQuestion',
  matcher: /(забудь |удали(ть)? )(что )?.*/,

  async handler(ctx) {
    // const question = ctx.body.question;
    const question = ctx.message.replace(/(забудь |удали(ть)? )(что )?(где )?/, '');
    return processDelete(ctx, question);
  },

  processDelete: processDelete
};
