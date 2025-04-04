const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.js");
const { required } = require("joi");

const planSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    type: {
        type: String,
        enum: [
            "Basic",
            "Standard",
            "Premium",
        ],
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    price: {
        type: Number,
        min: 0,
        max: 20000,
        required: true,
    },
    slots: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
    },
    expDate: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        default: "https://images.ctfassets.net/4cd45et68cgf/4nBnsuPq03diC5eHXnQYx/d48a4664cdc48b6065b0be2d0c7bc388/Netflix-Logo.jpg",
        required: true,
    },
    // members: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    // }],
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
});

// main()
//   .then((res) => {
//     console.log("connection established");
//   })
//   .catch((err) => console.log(err));

// async function main() {
//   const mongoURL = "mongodb://127.0.0.1:27017/SubSplitfinal";
//   await mongoose.connect(mongoURL);
// }


let Plan = mongoose.model("plan", planSchema);
module.exports = Plan;