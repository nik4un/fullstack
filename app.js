const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const { mongoURI } = require('./config/keys');
const jwtStrategy = require('./middleware/passport');

const app = express();

// Подключение с базе данных
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB has been connected!'))
  .catch(error => console.log(error));

app.use(passport.initialize());
passport.use(jwtStrategy);
// require('./middleware/passport')(passport);

app.use(morgan('dev'));
// при обращении к папке "uploads" делаем её статической,
// чтобы сервер мог отдавать файл по запросу браузера
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

/* --- Для production --- */
// определяем идет ли сборка на production
// если да, то проделываем следующее
if (process.env.NODE_ENV === 'production') {
  // делаем папку, в которвй сбъюлдели клиентскую часть, статической
  app.use(express.static('client/dist/client'));

  // на любой запрос к серверу отдаем index.html
  app.get('*', (req, res) => {
    res.sendFile(
      // с помощью библиотеки path прописываем путь до файла index.html
      path.resolve(__dirname, 'client', 'dist', 'client', 'index.html'),
    );
  });
}
/* --- */

module.exports = app;
