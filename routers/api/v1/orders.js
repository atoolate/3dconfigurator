const express = require('express');
const router = express.Router();

// Controller
const ordersController = require('../../../controllers/api/v1/orders');

// get all orders
router.get('/', ordersController.getAllOrders);

// get order by id
router.get('/:id', ordersController.getOrderById);

// POST method route
router.post('/', ordersController.createOrder);

// PUT method route
router.put('/:id', ordersController.updateOrder);

// DELETE method route
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
