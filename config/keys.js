// поскольку все данные приложения беруться из этого файла, здесь будет выбор
const keysProd = require('./keys.prod');
const keysDev = require('./keys.dev');

if (process.env.NODE_ENV === 'production') {
  module.exports = keysProd;
} else {
  module.exports = keysDev;
}
