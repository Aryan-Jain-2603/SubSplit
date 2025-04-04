const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = Schema({
    email:{
        type: String,
        required: true,
    },
    listings: [{
        type: Schema.Types.ObjectId,
        ref: "plan",
    }],
    money: {
        type: Number,
        default: 1000,
    },
    subscriptions: [
        {
            type: Schema.Types.ObjectId,
            ref: "plan",
        }
    ]
    
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);