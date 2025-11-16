const mongoose = require("mongoose");
const { type } = require("../schema");
const { required, ref } = require("joi");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title :{
        type : String,
        required : true,

    },

    description :{
        type : String,
        required : true,
    },
    Image: {
    filename: {
        type: String
    },
    url: {
        type: String,
        set: (v) =>
            v === " "
                ? "https://img.freepik.com/free-psd/modern-luxury-villa-architectural-design_191095-83148.jpg"
                : v
    }
    },

    price: {
        type : Number,
        required : true,
    },
    location :{
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
            required : true,
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry :{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
           type: [Number],
           required: true
        }
    }
    
});

//handling listing delete middlewares
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({ _id:{ $in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
