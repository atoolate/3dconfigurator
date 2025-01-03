const Order = require('../../../models/Order');

// GET
// /api/v1/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json({
            "status": "success",
            "data": {
                "orders": orders
            }
        });
    } catch (err) {
        res.status(500).send('Error getting orders');
    }
};

// /api/v1/orders/:id
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send('The order with the given ID was not found');
        }
        return res.send(order);
    } catch (err) {
        res.status(500).send('Error getting order');
    }
};

// POST
const createOrder = async (req, res) => {
    const { shoeName, user, shoeConfig } = req.body;
    const order = new Order({
        shoeName,
        user,
        shoeConfig
    });
    try {
        await order.save();
        console.log("Order created");
        res.status(201).send(order);
    } catch (err) {
        res.status(500).send('Error creating order');
    }
};

// PUT
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).send('The order with the given ID was not found');
        }
        res.send(order);
    } catch (err) {
        res.status(500).send('Error updating order');
    }
};

// DELETE
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).send('The order with the given ID was not found');
        }
        res.send('Order deleted');
    } catch (err) {
        res.status(500).send('Error deleting order');
    }
};

module.exports.getAllOrders = getAllOrders;
module.exports.getOrderById = getOrderById;
module.exports.createOrder = createOrder;
module.exports.updateOrder = updateOrder;
module.exports.deleteOrder = deleteOrder;