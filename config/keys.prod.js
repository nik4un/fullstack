// для продакшен будем брать значения, помещаемые в process.env из файла .env
module.exports = {
  serverPort: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  cert: process.env.JWT, // сертификат для token
};
