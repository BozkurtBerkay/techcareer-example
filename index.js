require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
})

app.use('/api', require('./routes/orderRoutes'))
app.use('/api', require('./routes/suppliersRoutes'))


app.listen(PORT, () => {
    console.log("Sunucu çalışıyor");
})