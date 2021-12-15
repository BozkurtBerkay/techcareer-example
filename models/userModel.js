const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    products:
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    failLoginCount: {
        type: Number,
        default: 0
    },
    addDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema, 'user')

module.exports = {
    User
}