const express = require('express');
const router = express.Router();
const { createOrder, getOrder } = require('../controllers/checkoutController');

router.post('/', createOrder);
router.get('/order/:orderId', getOrder);

module.exports = router;
