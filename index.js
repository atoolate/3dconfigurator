const express = require('express');
const app = express();
const ordersRouter = require('./routers/api/v1/orders');
const usersRouter = require('./routers/api/v1/users');

// MongoDB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/threejssneakers');

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
const port = process.env.PORT || 3000;
// PORT
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
