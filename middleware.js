const express = require("express");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const isLoggedIn = (req, res, next) =>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged to access");
        return res.redirect("/login");
    };
    next();
    
};

const saveRedirectUrl = (req ,res , next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async(req, res, next) =>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listing/${id}`);

    };
    next();
};

const isReviewAuthor = async(req, res, next) =>{
    let {id, reviewsId} = req.params;
    let review = await Review.findById(reviewsId);
    
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);

    };
    next();
}

module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isReviewAuthor,
};
