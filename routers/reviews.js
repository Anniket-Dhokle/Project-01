const express = require("express");
const router = express.Router({mergeParams : true});
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

//server error handling request middleware for listing
const validateReviews = (req, res, next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

const reviewsControllers = require("../controllers/reviews.js");


//reviews crate route
router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewsControllers.createReview));

//reviews delete route
router.delete("/:reviewsId",isReviewAuthor, wrapAsync(reviewsControllers.deleteReview));

module.exports = router;
