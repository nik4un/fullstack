const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // 1-й параметрр - ошибка, 2-й - директория для загрузки файлов,
    // которая к этому моменту должна существовать
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');
    cb(null, `${date}-${file.originalname}`); // ошибка и имя файла, которое мы формируем
  },
});

const fileFilter = (req, file, cb) => {
  // проверка на то, что этот файл является изображением
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5, // объём файла 5Mb
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});
