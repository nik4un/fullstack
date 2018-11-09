const mongoose = require('mongoose');

// создаем схему для модели, исползуя деструктурирование
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// сооздаём и экспортируем модель для колекции "users" и схемой "userSchema"
module.exports = mongoose.model('users', userSchema);
