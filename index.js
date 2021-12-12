const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectionHelper = require('./dbConnect/connectionHelper');

const PORT = 5000;

connectionHelper.connect();

app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
})

app.use('/user', require('./routes/userRoutes'))
app.use('/api', require('./routes/orderRoutes'))
app.use('/api', require('./routes/supplierRoutes'))


app.listen(PORT, () => {
    console.log("Sunucu çalışıyor");
})