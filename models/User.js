const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    adress: {
        street: String,
        city: String,
        zip: String,
        country: String
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
