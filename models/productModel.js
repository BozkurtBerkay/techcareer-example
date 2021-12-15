const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: Schema.Types.ObjectId,
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
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    addDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', productSchema, 'product');

module.exports = {
    Product
}