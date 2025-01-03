// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    shoeName: String,
    user: String,
    shoeConfig: {
        color: String,
        size: Number,
        parts: {
            laces: {
                color: String,
                texture: String
            },
            // Add more parts as needed
            outside_1: {
                color: String,
                texture: String
            },
            outside_2: {
                color: String,
                texture: String
            },
            outside_3: {
                color: String,
                texture: String
            },
            inside: {
                color: String,
                texture: String
            },
            sole_bottom: {
                color: String,
                texture: String
            },
            sole_top: {
                color: String,
                texture: String
            }
        }
    },

});

// Model
const Order = mongoose.model('Order', orderSchema);

// Export
module.exports = Order;