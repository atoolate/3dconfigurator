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

// GET
const getAllOrders = (req, res) => {
    res.send(orders);
};

const getOrderById = (req, res) => {
    const order = orders.find(order => order.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).send('The order with the given ID was not found');
    }
    return res.send(order);
};

// POST
const createOrder = (req, res) => {
    res.send("Order created");
};

// PUT
const updateOrder = (req, res) =>{
    // Look up the order
    res.send("Order updated");
};

// DELETE
const deleteOrder = (req, res) => {
    res.send("Order deleted");
};


module.exports.getAllOrders = getAllOrders;
module.exports.getOrderById = getOrderById;
module.exports.createOrder = createOrder;
module.exports.updateOrder = updateOrder;
module.exports.deleteOrder = deleteOrder;