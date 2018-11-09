const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getByCategoryId = async (req, res) => {
  try {
    const positions = await Position.find({
      category: req.params.categoryId, // передается в строке запроса после ":"
      user: req.user.id, // передается passport - done(null, user)
    });
    res.status(200).json(positions);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async (req, res) => {
  try {
    const positions = await new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      user: req.use.id,
    }).save();
    res.status(201).json(positions); // 201 Created
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async (req, res) => {
  try {
    const positions = await Position.findOneAndUpdate(
      // в функцию findOneAndUpdate необходимо передать три параметра
      { _id: req.params.id }, // id в БД
      { $set: req.body }, // изменить запись в БД на значения из запроса
      { new: true }, // здесь true - чтобы вернулись обновленные значения, false - старые
    );
    res.status(200).json(positions);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = async (req, res) => {
  try {
    await Position.remove({ _id: req.params.id });
    res.status(200).json({
      message: 'Позиция удалена.',
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
