const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
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

module.exports = app;
