const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// [get] localhost:3300/api/order?offset=2&limit=5
module.exports.getAll = async (req, res) => {
  const query = {
    user: req.user._id,
  };
  // проверка на наличие начальной даты в запросе
  if (req.query.start) { // req.query.start - это значение "начальная data"
    query.date = {
      // $gte - означает в mongoose больше или равно
      $gte: req.query.start,
    };
  }

  // проверка на наличие конечной даты в запросе
  if (req.query.end) { // req.query.end - это значение "конечная data"
    if (!query.date) {
      query.date = {};
    }
    query.date.$lte = moment(req.query.end).add(1, 'd'); // $lte - означает в mongoose меньше или равно
  }

  // проверка на наличие номера заказа в запросе
  if (req.query.order) {
    query.order = +req.query.order;
  }
  try {
    const order = await Order
      .find(query)
      .sort({ date: -1 })
      // + означает приведение к чиловому формату
      .skip(+req.query.offset) // сколько элементов пропустить в найденном массиве
      .limit(+req.query.limit); // сколько элементов отобрать

    res.status(200).json(order);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async (req, res) => {
  try {
    const lastOrder = await Order
      .findOne({ user: req.user._id })
      .sort({ date: -1 }); // расположить в порядке убывания по полю "date"

    // находим номер последнего заказа, если такой имеется
    const maxOrder = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      list: req.body.list,
      user: req.user._id,
      order: maxOrder + 1,
    }).save();
    res.status(201).json(order);
  } catch (e) {
    errorHandler(res, e);
  }
};
