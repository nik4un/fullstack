// для продакшен будем брать из консольного ввода
module.exports = {
  serverPort: process.env.PORT || 3300,
  mongoURI: process.env.MONGO_URI,
  cert: process.env.JWT, // сертификат для token
};
