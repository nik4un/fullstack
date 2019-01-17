const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// функция, формирующая объект, в котором ключ - это дата заказа,
// а значение - массив заказов в этот день
const getOrdersMap = (orders = []) => {
  const ordersByDays = {};
  orders.forEach((order) => {
    const date = moment(order.date).format('DD.MM.YYYY');

    // исключение из аналитики сегодняшней даты
    if (date === moment().format('DD.MM.YYYY')) {
      return;
    }

    // формируюем объект
    if (!ordersByDays[date]) {
      ordersByDays[date] = [];
    }
    ordersByDays[date].push(order);
  });

  return ordersByDays;
};

const calculateRevenue = (orders = []) => orders.reduce((allOrdersSum, order) => {
  const orderSum = order.list
    .reduce((totalPrice, item) => totalPrice + item.cost * item.quantity, 0);
  return allOrdersSum + orderSum;
}, 0);

module.exports.overview = async (req, res) => {
  try {
    // получаем все заказы для пользователя
    const allOrders = await Order
      .find({ user: req.user._id })
      // сортируем по возрастанию даты
      .sort({ date: 1 });
    const ordersMap = getOrdersMap(allOrders);
    const yesterdayOrders = ordersMap[moment()
      .add(-1, 'd') // получение вчерашнего числа
      .format('DD.MM.YYYY')] || [];

    // кол-во заказов вчера
    const yesterdayOrdersNumber = yesterdayOrders.length;
    // кол-во заказов
    const totalNumberOfOrders = allOrders.length;
    // кол-во дней, в которые были сделаны заказы
    const totalNumberOfDays = Object.keys(ordersMap).length;
    // заказов в день
    const ordersPerDay = (totalNumberOfOrders / totalNumberOfDays).toFixed(0);
    // процент для колличества заказов
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
    // общая выручка
    const totalRevenue = calculateRevenue(allOrders);
    // выручка в день
    const revenuePerDay = totalRevenue / totalNumberOfDays;
    // выручка за вчера
    const yesterdayRevenue = calculateRevenue(yesterdayOrders);
    // Процент выручки
    const revenuePercent = (((yesterdayRevenue / revenuePerDay) - 1) * 100).toFixed(2);
    // сравнение выручки
    const compareRevenue = (yesterdayRevenue - revenuePerDay).toFixed(2);
    // сравнение кол-ва заказов
    const compareNumber = (totalNumberOfOrders - ordersPerDay).toFixed(2);

    res.status(200).json({
      revenue: {
        percent: Math.abs(+revenuePercent),
        compare: Math.abs(+compareRevenue),
        yesterday: +yesterdayRevenue,
        isHigher: +revenuePercent > 0,
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0,
      },
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.analytics = (req, res) => {

};
