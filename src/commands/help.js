const storage = require('../storage');
const commands = require('../commands');
const utils = require('../utils');

// команда по умолчанию (справка)
module.exports.welcome = async ctx => {
  if (ctx.message != 'ping') ctx.logMessage(`> ${ctx.message} (welcome)`);
  let msg;
  const buttons = ['помощь', 'примеры', 'что ты знаешь', 'команды'];
  if (ctx.user.state.visitor.visits > 1 || ctx.user.state.visit.messages > 1) {
    msg = ['Привет' + (ctx.user.state.visitor.lastVisitLong ? ', давно не виделись' : '')];
    return ctx.reply(msg, buttons);
  } else {
    msg = [
      'Я умею запоминать продукты в холодильнике и их срок годности.',
      'Скажите "примеры", чтобы узнать, как можно добавлять продукты'
    ];
    return ctx.reply(msg, buttons);
  }
};

// помощь при первом входе "тур"
module.exports.firstHelp = async ctx => {
  ctx.logMessage(`> ${ctx.message} (welcomeHelp)`);
  const buttons = ['помощь', 'примеры', 'что ты знаешь', 'команды'];
  return ctx.replySimple(
    [
      'Скажите, что вы кладёте в холодильник и когда заканчивается срок годности.',
      'Потом можно спрашивать: "Что в холодильнике?", "Что закончится в ближайшие три дня?",',
      '"Что закончилось?"',
      'Если надо удалить только что добавленное, скажите "удали последнее".',
      'Чтобы всё стало понятно, посмотрите примеры использования, скажите "примеры".',
      'Если хотите узнать подробности команд, скажите "помощь".'
    ],
    buttons
  );
};

// команда "помощь"
module.exports.help = async ctx => {
  if (ctx.message != 'ping') ctx.logMessage(`> ${ctx.message} (help)`);
  return ctx.replySimple(
    'Я умею запоминать, отвечать что и когда, забывать. Что из этого вы хотите знать?',
    [
      'запоминать',
      'отвечать',
      'отвечать что',
      'отвечать когда',
      'забывать',
      'что ты знаешь',
      'примеры',
      'первая помощь'
    ]
  );
};

// команда помощь: "запоминать"
module.exports.remember = async ctx => {
  ctx.logMessage(`> ${ctx.message} (remember)`);
  const buttons = ['мандарины испортятся через неделю', 'сосиски до 28 ноября'];
  return ctx.replySimple(
    [
      'Скажите название продукта и когда он закончится.',
      'Для некоторых продуктов можно говорить только дату выпуска.',
      'Примеры:',
      buttons.join('\n')
    ],
    buttons
  );
};

// команда помощь: "отвечать"
module.exports.answer = async ctx => {
  ctx.logMessage(`> ${ctx.message} (answer)`);
  const buttons = ['что закончится на этой неделе', 'когда прокиснет молоко', 'что закончилось'];
  return ctx.replySimple(
    [
      'Вы можете задавать вопросы о списке продуктов или о конкретном продукте.',
      'Вопросы могут быть о сроке годности или о наличии.',
      'Например:',
      buttons.join('\n')
    ],
    buttons
  );
};

// команда помощь: "отвечать что"
module.exports.what = async ctx => {
  ctx.logMessage(`> ${ctx.message} (what)`);
  const buttons = ['что закончится на этой неделе', 'что в холодильнике', 'что закончилось'];
  return ctx.replySimple(
    [
      'Вы можете задавать вопросы о списке продуктов.',
      'Вопросы могут быть о сроке годности и о наличии.',
      'Например:',
      buttons.join('\n')
    ],
    buttons
  );
};

// команда помощь: "отвечать когда"
module.exports.when = async ctx => {
  ctx.logMessage(`> ${ctx.message} (when)`);
  const buttons = ['когда закончится молоко', 'когда изготовлено молоко'];
  return ctx.replySimple(
    [
      'Вы можете узнать о конкретном продукте, можно спросить, когда он изготовлен или закончится.',
      'Примеры:',
      buttons.join('\n')
    ],
    buttons
  );
};

// команда помощь: "забывать"
module.exports.forget = async ctx => {
  ctx.logMessage(`> ${ctx.message} (forget)`);
  const buttons = ['удали последнее', 'удали мандарины', 'забудь все'];
  return ctx.replySimple(
    [
      'Можно удалить последний ответ, сказав "удали последнее".',
      'Если надо удалить что-то другое, скажите что, например, "удали мандарины".',
      'Другие примеры: "сыр кончился", "выбросил молоко".',
      'Если надо очистить память, скажите: "забудь все".'
    ],
    buttons
  );
};

// команда помощь: "примеры"
module.exports.examples = async ctx => {
  ctx.logMessage(`> ${ctx.message} (examples)`);
  const buttons = [
    'мандарины испортятся через неделю',
    'персики до 28 июля',
    'хлеб был куплен в понедельник',
    'рожки сваренны позавчера',
    'сыр протухнет через неделю',
    'шпроты хранятся до 23 апреля 2020'
  ];
  return ctx.replySimple(
    ['Разные примеры добавления продуктов и получения ответов:', buttons.join('\n')],
    buttons
  );
};
