const mongoose = require("mongoose");
const env = require("../config/env");

module.exports = {
    connect() {
        mongoose.connect(env.MONGODB_KEY).then(function () {
            console.log('Connected to Mongodb');
        }).catch(function () {
            console.error('Error connect Mongodb');
        });
    }
}


