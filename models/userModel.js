const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    product: {
        type: Array,
        default: []
    },
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
        default: true },
}, {
    timestamps: true
})

const userModel = mongoose.model('Users', userSchema)

module.exports = {
    userModel
}