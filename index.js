require('dotenv').config();

const express = require('express');
const app = express();
const ordersRouter = require('./routers/api/v1/orders');
const usersRouter = require('./routers/api/v1/users');
const mongoose = require('mongoose');


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Routes
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/users', usersRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// PORT
const port = process.env.SERVER_PORT || config.server.port;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
