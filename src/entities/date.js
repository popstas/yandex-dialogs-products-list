const Az = require('az');

const nluDateToTime = nlu => {
  if(nlu.month_is_relative) return; // not implemented

  if(nlu.day_is_relative){
    return new Date().getTime() + nlu.day * 86400 * 1000
  } else {
    if(!nlu.day) return; // not implemented

    if(nlu.month && nlu.day){
      const y = nlu.year || new Date().getFullYear();
      const m = nlu.month - 1
      return new Date(y, m, nlu.day).getTime();
    }
  }
}

const dateEntityExtractor = ctx => {
  const words = ctx.message.split(' ');
  // const tokens = Az.Tokens(ctx.message).done();
  /* const posts = words.map(word => {
    const morph = Az.Morph(word);
    if (morph.length === 0) return '?';
    return morph[0].tag.POST;
  }); */

  const nowTime = new Date().getTime();
  const dateMatchers = [
    {
      date: new Date().setTime(nowTime - 86400 * 1000 * 1),
      words: ['вчера', 'вчерашний']
    },
    {
      date: new Date(),
      words: ['сегодня', 'сегодняшний']
    },
    {
      date: new Date().setTime(nowTime - 86400 * 1000 * 3),
      words: ['ближайшие 3 дня']
    }
  ];

  words.forEach(word => {
    dateMatchers.forEach(matcher => {
      const isMatch = matcher.words.find(matchWord => word == matchWord);
      if (isMatch) {
        return matcher.date;
      }
    });
  });
}

// распознает даты
module.exports = () => (ctx, next) => {
  ctx.nlu = ctx.nlu || { entities: [] };
  ctx.entities = ctx.entities || {};

  // берем яндексовскую дату, если есть
  const nluDate = ctx.nlu.entities.find(entity => entity.type == 'YANDEX.DATETIME');
  if(nluDate) ctx.entities.date = nluDateToTime(nluDate.value);

  // своя добивает нераспознанное
  if(!ctx.entities.date) ctx.entities.date = dateEntityExtractor(ctx);

  console.log('ctx.nlu: ', ctx.nlu);
  console.log('ctx.entities: ', ctx.entities);
  return next(ctx);
};
