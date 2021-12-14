const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantityPerUnit: {
        type: String,
        required: true
    },
    unitsInStock: {
        type: Number,
        default: 0
    },
    discontinued: {
        type: Boolean,
        default: false,
    },
    userId: String,
    categoryId: String,
    addDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
})

const productModel = mongoose.model('Products', productSchema);

module.exports = {
    productModel
}