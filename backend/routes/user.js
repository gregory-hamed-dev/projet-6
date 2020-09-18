const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const securedPassword = require('../middleware/validpassword')

router.post('/signup', securedPassword, userCtrl.signup);
router.post('/login', securedPassword, userCtrl.login);

module.exports = router;