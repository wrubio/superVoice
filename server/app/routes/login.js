const router = require('express').Router();
const loginController = require('../controllers/login-controller');

router.post('/', loginController.loginSystem);

module.exports = router;