const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

const auth = require('../middleware/auth');

router.post('/sign', userController.sign);
router.post('/log', userController.log);
router.get('/getHomeUserInfo/:id', auth, userController.getHomeUserInfo);
router.get('/getUserInfo/:id', auth,  userController.getUserInfo);

module.exports = router;