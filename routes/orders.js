const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders_controller');


router.get('/', OrdersController.getOrders);
router.get('/:id_order', OrdersController.getOrderById);
router.post('/', OrdersController.insertOrder);
router.delete('/', OrdersController.deleteOrder);


module.exports = router;