const User = require('../../../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({
            "status": "success",
            "data": {
                "users": users
            }
        });
    } catch (err) {
        res.status(500).send('Error getting users');
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('The user with the given ID was not found');
        }
        return res.send(user);
    } catch (err) {
        res.status(500).send('Error getting user');
    }
};

const createUser = async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        adress: {
            street: req.body.adress.street,
            city: req.body.adress.city,
            zip: req.body.adress.zip,
            country: req.body.adress.country
        }
    });

    try {
        await user.save();
        console.log("User created");
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send('Error creating user');
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send('The user with the given ID was not found');
        }
        res.send(user);
    } catch (err) {
        res.status(500).send('Error updating user');
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('The user with the given ID was not found');
        }
        res.send('User deleted');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
};

module.exports.getAllUsers = getAllUsers;
module.exports.getUserById = getUserById;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
