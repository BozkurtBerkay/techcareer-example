const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantityPerUnit: String,
    unitPrice: Number,
    unitsInStock: Number,
    discontinued: {
        type: Boolean,
        default: false,
    },
    userId: String,
    categoryId: String,
})

const productModel = mongoose.model('Products', productSchema);

module.exports = {
    productModel
}