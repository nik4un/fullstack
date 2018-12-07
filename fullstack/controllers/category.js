const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async (req, res) => {
  try {
    // ищем категории, созданные пользователем, отправившим запрос
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id); // id - параметр из строки запроса
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = async (req, res) => {
  try {
    // удаляем категорию, по переданному в параметрах id
    await Category.remove({ _id: req.params.id });
    // удаляем все позиции этой категории
    await Position.remove({ category: req.params.id });
    res.status(200).json({
      message: 'Категория удалена.',
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    // req.user._id будет только в том случае, если перед этим контроллером в цепочке стоит passport
    user: req.user._id,
    // req.file формирует middleware "upload"
    imageSrc: req.file ? req.file.path : '', // загрузка файла необязателна, поэтому проверка
  });

  try {
    await category.save();
    res.status(201).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async (req, res) => {
  try {
    const updatedCategory = {
      name: req.body.name,
    };
    if (req.file) { // req.file формирует middleware "upload"
      updatedCategory.imageSrc = req.file.path;
    }
    const category = await Position.findOneAndUpdate(
      // в функцию findOneAndUpdate необходимо передать три параметра
      { _id: req.params.id }, // id в БД
      { $set: updatedCategory }, // изменить запись в БД на измененные значения
      { new: true }, // здесь true - чтобы вернулись обновленные значения, false - старые
    );
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};
