require('dotenv').config();
const mongoose = require('mongoose');

const connectionHelper = {
    connect: async () => {
        await mongoose.connect(process.env.MONGODB_URL, () => {
            console.log("MongoDB bağlandı...");
        });
    }
}

module.exports = connectionHelper;
