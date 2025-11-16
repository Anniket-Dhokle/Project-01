const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index =
    async(req, res) => {
    let allListing = await Listing.find();
    res.render("index.ejs", {allListing});

};

module.exports.renderNewForm = (req, res) =>{
    res.render("new.ejs");
};

module.exports.showListing = async(req, res) =>{
    let {id} = req.params;
     const list = await Listing.findById(id).populate({
        path : "reviews", populate : {
            path : "author",
        },
        }).populate("owner");
        
     if(!list){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
     };
     res.render("show.ejs", {list});


};

module.exports.renderEditForm = async(req, res) =>{
    let {id}  = req.params;
    let list =  await Listing.findById(id);
    if(!list){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    };
    let originalImageUrl = list.Image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("edit.ejs", {list, originalImageUrl});
};

module.exports.updateListing = async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let updateList = await Listing.findByIdAndUpdate(id, req.body, { new: true });

    if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        //cloud update
        updateList.Image = {url, filename};
        await updateList.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);

};

module.exports.deleteListing = async(req, res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};

module.exports.createListing = async(req, res, next) =>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

        let {title, description, Image, price, location, country} = req.body.listing;
        const newList = new Listing({
            title,
            description,
            Image,
            price,
            location,
            country,
        });
        newList.owner = req.user._id;
        newList.Image = {url, filename};
        newList.geometry = response.body.features[0].geometry;

        let savedListing = await newList.save();
        console.log(savedListing);
        req.flash("success", "New Listing Created!");
        res.redirect("/listing");

};

