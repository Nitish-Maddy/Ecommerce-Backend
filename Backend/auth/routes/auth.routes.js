const express = require('express')
const router = express.Router();
const controller = require("../controllers/auth.controller");


router.post('/register',controller.register);
router.post('/login', controller.login);
router.post('/', controller.register);

module.exports = router