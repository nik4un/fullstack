const express = require('express');
const controller = require('../controllers/auth');

const router = express.Router();

// localhost:3300/api/auth/login
router.post('/login', controller.login);

// localhost:3300/api/auth/registration
router.post('/registration', controller.registration);

module.exports = router;
