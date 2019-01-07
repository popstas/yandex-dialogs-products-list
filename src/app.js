'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Alice, Reply, Stage, Scene } = require('yandex-dialogs-sdk');
const middlewares = require('./middlewares');
const matchers = require('./matchers');
const config = require('./config');
const commands = require('./commands/index');
const utils = require('./utils');
const commandsHelp = require('./commands/help');

const alice = new Alice();

class YandexDialogsProductsList {
  constructor() {
    this.init();
  }

  // returns express instance
  handlerExpress() {
    const app = express();
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    app.use(express.static('static'));
    app.post(config.API_ENDPOINT, async (req, res) => {
      const jsonAnswer = await alice.handleRequest(req.body);
      res.json(jsonAnswer);
    });
    return app;
  }

  async init() {
    // добавляют функции в ctx
    alice.use(middlewares.confirm());
    alice.use(middlewares.replySimple());
    alice.use(middlewares.replyRandom());
    alice.use(middlewares.logMessage());

    // изменяют ctx во время запроса
    alice.use(middlewares.store());
    alice.use(middlewares.corrector());
    alice.use(middlewares.cleaner());
    alice.use(middlewares.counter());

    await utils.initMorph();

    // при наличии session.confirm запускаем сценарий подтверждения
    alice.command(matchers.confirm(), commands.confirm);

    // ошибка с базой данных
    alice.command(matchers.error(), ctx => {
      console.log('! database error');
      return ctx.replyRandom([
        'Ой, что-то мне нехорошо, зайдите попозже...',
        'Пятьсоттретья ошибка, позовите админа! Хотя он уже наверное в курсе.',
        'Какой сейчас год? Кто я? Я потеряла память...'
      ]);
    });

    // привет
    alice.command(['', 'привет', 'приветствие'], commandsHelp.welcome);

    // тестовые команды
    alice.command('демо данные', ctx => {
      ctx.logMessage(`> ${ctx.message} (demoData confirm)`);
      ctx.confirm('Точно?', commands.demoData, ctx => ctx.reply('Как хочешь'));
    });

    alice.command('забудь все вообще', ctx => {
      ctx.logMessage(`> ${ctx.message} (clearDataAll confirm)`);
      return ctx.confirm('Точно?', commands.clearDataAll, ctx => ctx.reply('Как хочешь'));
    });

    // запомни ...
    const inAnswerStage = new Stage();
    const inAnswerScene = new Scene('in-answer');
    inAnswerScene.command(/^отмена/i, commands.cancel);
    inAnswerScene.command(matchers.rememberSentence(), commands.remember);
    inAnswerScene.any(commands.inAnswerProcess);
    alice.command('запомни', commands.inAnswerEnter);
    inAnswerStage.addScene(inAnswerScene);
    alice.use(inAnswerStage.getMiddleware());

    // команда запомни ...
    alice.command(matchers.rememberSentence(), commands.remember);

    // команды
    alice.command('команды', commands.commands);

    // отмена
    alice.command(/^отмена/i, commands.cancel);

    // пока
    alice.command(matchers.goodbye(), commands.sessionEnd);

    // Алиса
    alice.command(/(алиса|алису)/i, ctx =>
      ctx.reply('Чтобы вернуться к Алисе, скажите "Алиса вернись"')
    );

    // оскорбление
    alice.command(matchers.abuse(), ctx =>
      ctx.reply('Я быстро учусь, вернитесь через пару дней и убедитесь!')
    );

    // забудь все, должно быть перед "удали последнее"
    alice.command(
      ['забудь всё', 'забудь все', 'удали все', 'забыть все', 'сотри все', 'стереть все'],
      ctx => ctx.confirm('Точно?', commands.clearData, ctx => ctx.reply('Как хочешь'))
    );

    // удали последнее
    alice.command(
      /^(удали последнее|забудь последнее|забудь последнюю запись|удали|удалить|забудь)$/i,
      commands.deleteLast
    );
    alice.command(/(забудь |удали(ть)? )(что )?.*/, commands.deleteQuestion);

    // спасибо
    alice.command(matchers.thankyou(), ctx =>
      ctx.replyRandom([
        'Всегда пожалуйста',
        'Не за что',
        'Обращайтесь!',
        'Пожалуйста',
        'Пожалуйста',
        'Пожалуйста',
        'Пожалуйста',
        'Пожалуйста'
      ])
    );

    // молодец
    alice.command(matchers.compliment(), ctx =>
      ctx.replyRandom([
        'Спасибо, стараюсь :)',
        'Ой, так приятно )',
        'Спасибо!',
        'Спасибо!',
        'Спасибо!',
        'Спасибо!',
        'Спасибо!'
      ])
    );

    // это ломает команды "удали последнее", "удали кокретное"
    // alice.command(['что ты знаешь', 'что ты помнишь'], commands.known);
    alice.command(
      ['что ты знаешь', 'что ты помнишь', 'ты знаешь', 'что ты запомнила'],
      commands.known
    );

    // ниже все команды про помощь
    alice.command(['первая помощь', '1 помощь'], commandsHelp.firstHelp);

    // помощь
    alice.command(matchers.help(), commandsHelp.help);
    alice.command(['запоминать', 'как запомнить', 'как запоминать'], commandsHelp.remember);
    alice.command(['забывать', 'как забывать', 'как забыть'], commandsHelp.forget);
    alice.command(['отвечать'], commandsHelp.answer);
    alice.command(['отвечать что'], commandsHelp.what);
    alice.command(['отвечать когда'], commandsHelp.when);

    alice.command(['сценарии', 'примеры', 'примеры использования'], commandsHelp.examples);

    // самые общие команды должны быть в конце
    // что ...
    alice.command(/^(что) /, commands.what);
    // где ...
    alice.command(/^(когда) /, commands.when);
    // непонятное
    alice.command(/^(как|зачем|почему) /, commands.dontKnow);

    alice.any(commands.any);
  }

  listen(port) {
    const app = this.handlerExpress();
    app.listen(port);
    console.log('listen ' + port);
  }
}

module.exports = YandexDialogsProductsList;
