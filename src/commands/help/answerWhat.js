module.exports = {
  intent: 'helpAnswerWhat',
  matcher: ['отвечать что', 'отвечает что'],

  handler(ctx) {
    const buttons = ['что закончится на этой неделе', 'что в холодильнике', 'что закончилось'];
    return ctx.reply(
      [
        'Вы можете задавать вопросы о списке продуктов.',
        'Вопросы могут быть о сроке годности и о наличии.',
        'Например:',
        buttons.join('\n')
      ],
      buttons
    );
  }
};
