const express = require('express');
const router = express.Router();
const authController = require('../../controller/AuthControllers/authController');

router.post('/', authController.handleLogin);

module.exports = router;