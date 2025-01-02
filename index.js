const express = require('express');
const app = express();
const ordersRouter = require('./routers/api/v1/orders');

app.use(express.json());
app.use('/api/v1/orders', ordersRouter);

const port = process.env.PORT || 3000;
// PORT
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
