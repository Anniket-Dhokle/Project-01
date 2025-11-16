const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);
    
    await newReview.save();
    let res1 = await listing.save();
    console.log(res1);
    req.flash("success", "New Review Created!");

    res.redirect(`/listing/${listing._id}`);
};

module.exports.deleteReview = async(req, res) =>{
    let {id, reviewsId} = req.params;

    await Listing.findByIdAndUpdate(id);
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success", "Review  Deleted!");

    res.redirect(`/listing/${id}`);

};


