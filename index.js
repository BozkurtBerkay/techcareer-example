const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const connectionHelper = require('./dbConnect/connectionHelper');
const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');
require('./middleware/google')
const PORT = 5000;

connectionHelper.connect();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
})

app.use('/user', require('./routes/userRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/category', require('./routes/categoryRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/suppliers', require('./routes/supplierRoutes'))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
    console.log("Sunucu çalışıyor", PORT);
})