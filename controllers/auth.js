// Подключаем пакет шифрования bcryptjs
const bcrypt = require('bcryptjs');
// Подключаем пакет jsonwebtoken
const jwt = require('jsonwebtoken');
// Подключаем модель для users
const User = require('../models/User');
const { cert } = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

// const User = mongoose.model('users', userSchema);

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });
  if (candidate) {
    // Пользователь с полученным email существует, нужно проверить пароль
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      // Пароль совпал, генрация токена
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id,
      }, cert, { expiresIn: 3600 });
      res.status(202).json({
        token: `Bearer ${token}`, // Bearer означает: "дать доступ к носителю этого знака"
      });
    } else {
      // Пароли не совпали
      res.status(401).json({
        message: 'Неверный пароль, проверте правильность ввода пароля.',
      });
    }
  } else {
    // Пользователя с данным email нет, нужно об этом сообщить
    res.status(404).json({
      message: 'Пользователь с этим email не найден',
    });
  }
};

module.exports.register = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });
  if (candidate) {
    // Пользователь с полученным email существует, нужно об этом сообщить
    res.status(409).json({
      message: 'Этот email уже занят.',
    });
  } else {
    // Нужно создать запись пользователя
    const salt = bcrypt.genSaltSync(10); // Создание salt для шифрования
    const { password } = req.body;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt), // Создание шифрованного пароля
    });
    try {
      await user.save();
      res.status(201).json({
        email: user.email,
        id: user._id,
      });
    } catch (e) {
      errorHandler(res, e);
    }
  }
};
