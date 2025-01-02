const express = require('express');
const router = express.Router();

// Dummy data
const orders = [
    {
        id: 1,
        name: 'John Doe',
        shoeConfig: {
            color: 'blue',
            size: 10
        },
        status: 'pending'
    },
    {
        id: 2,
        name: 'Jane Doe',
        shoeConfig: {
            color: 'red',
            size: 9
        },
        status: 'delivered'
    }
]
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
