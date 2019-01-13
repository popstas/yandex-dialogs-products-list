const Tomita = require('tomita-parser');

const tomitaParse = async msg => {
  return new Promise((resolve, reject) => {
    new Tomita(msg, __dirname + '/../../tomita/whatWhere/config.proto', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

// экспериментальный томита-парсер
module.exports = () => async (ctx, next) => {
  ctx.entities = ctx.entities || {};

  const start = new Date().getTime();
  ctx.entities.tomita = await tomitaParse(cleanMsg);
  console.log('tomita parsed:', Math.round(new Date().getTime() - start));
  console.log('tomita: ', ctx.entities.tomita);

  return next(ctx);
};
