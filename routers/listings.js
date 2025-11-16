const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

const listingControllers = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//server error handling request middleware for listing
const validateListing = (req, res, next) =>{
    let{error} = listingSchema.validate(req.body.listing);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

router.route("/")
      .get( wrapAsync(listingControllers.index))
      .post(isLoggedIn,upload.single('listing[Image]'), validateListing,
       wrapAsync(listingControllers.createListing));
      

//new listings
router.get("/new", isLoggedIn, listingControllers.renderNewForm);


router.route("/:id")
      .get( wrapAsync(listingControllers.showListing))
      .put(isLoggedIn, isOwner,upload.single('listing[Image]'), validateListing,wrapAsync(listingControllers.updateListing))
      .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// //all listing route
// router.get("/", wrapAsync(listingControllers.index));


//show route
// router.get("/:id", wrapAsync(listingControllers.showListing));

//create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingControllers.createListing));

//edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));


//put route for saving update Route
// router.put("/:id",isLoggedIn, isOwner, validateListing,wrapAsync(listingControllers.updateListing));

//delete listing
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));


module.exports = router;
