module.exports = {
  intent: 'helpAnswerWhen',
  matcher: ['отвечать когда', 'отвечает когда'],

  handler(ctx) {
    const buttons = ['когда закончится молоко', 'когда изготовлено молоко'];
    return ctx.reply(
      [
        'Вы можете узнать о конкретном продукте, можно спросить, когда он изготовлен или закончится.',
        'Примеры:',
        buttons.join('\n')
      ],
      buttons
    );
  }
};
