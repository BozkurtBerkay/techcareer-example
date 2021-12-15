const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
})

const Category = mongoose.model('Category', categorySchema, 'category' );

module.exports = {
    Category
}