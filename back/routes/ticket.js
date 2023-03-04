const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');

const auth = require('../middleware/auth');

router.post('/create', auth, ticketController.create);
router.get('/getAll/:id', auth, ticketController.getAll);
router.post('/changeStatus/:id', auth, ticketController.changeStatus);

module.exports = router;
