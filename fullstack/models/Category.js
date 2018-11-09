const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    default: '',
  },
  user: {
    ref: 'users', // ссылка на id пользователя в колекции "users"
    type: Schema.Types.ObjectId, // тип id, которое создает БД
  },
});

module.exports = mongoose.model('categories', categorySchema);
