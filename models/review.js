const mongoose = require("mongoose");
const { strict, type, max } = require("../schema");
const { string, number, date, required, ref } = require("joi");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : {
        type : String,
        required: true,
    },
    rating : {
        type: Number,
        min : 1,
        max : 5,
        required : true,
    },
    createdAt :{
        type : Date,
        default : Date.now,
    },
    author :{
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

