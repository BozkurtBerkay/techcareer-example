const mongoose = require('mongoose')
const { Schema } = mongoose


const userLogSchema = new Schema({
    userId: String,
    addDate: { type: Date, default: Date.now },
    loginType: String,
    ipAddress: String

})

const userLogModel = mongoose.model('WebUserLog', userLogSchema );

module.exports = {
    userLogModel
}