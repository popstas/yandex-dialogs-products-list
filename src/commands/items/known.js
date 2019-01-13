module.exports = {
  intent: 'known',
  matcher: [
    'что ты знаешь',
    'что ты помнишь',
    'ты знаешь',
    'что ты запомнила',
    'что ты поняла',
    'что ты хочешь'
  ],

  async handler(ctx) {
    // buttons
    let products = ctx.user.data.map(item => item.product);
    const buttons = products.map(product => 'когда закончится ' + product);

    // text
    let text = [];
    if (products.length > 0) {
      text.push('В холодильнике лежат:\n');
      text.push(products.join('\n'));
    } else {
      text.push('Я еще ничего не знаю, сначала расскажите мне, что где находится.');
    }

    return ctx.reply(text, buttons);
  }
};
