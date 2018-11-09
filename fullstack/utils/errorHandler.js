module.exports = (res, error) => {
  res.status(500).json({
    susses: false,
    message: error.message ? error.message : error,
  });
};
