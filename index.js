if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_DB_URL = process.env.MONGO_ATLAS_URL;       //mongoose Atlas URL

main()
.then(() =>{
    console.log("Connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_DB_URL);
    
};

const listingsRouter = require("./routers/listings.js");
const reviewsRouter = require("./routers/reviews.js");
const usersRouter = require("./routers/user.js"); 

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//connect mongo store session
const store = MongoStore.create({
    mongoUrl : MONGO_DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
//session error handler
store.on("error", () =>{
    console.log("ERROR in MONGO SESSION STORE" , err);
});

//sessions use
const sessionOptions = {
    store: store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demoUser", async(req, res) =>{
//     let fakeUser = new User({
//         email : "ani@12gmail.com",
//         username : "delta",
//     });
//     let newUser = await User.register(fakeUser, "hello");
//     res.send(newUser);
// });


//routers
app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", usersRouter);


// app.get("/testListing", (req, res) =>{
//     let newList = new Listing({
//         title : "Sinhgad Villa",
//         description : "Luxurious Villa near by Lonavala beauty Lake.",
//         price : 12000,
//         image : " ",
//         location : "Lonavala",
//         country : "India",
//     });

//     newList.save()
//     .then(() =>{
//          console.log("villa ");
//     })
//     .catch((err) =>{
//         console.log(err);
//     });

// });

//all request error handler
app.all("/*anything", (req, res, next) =>{
    next(new ExpressError(404, "Page not Found!"));
});

//server error middleware handler
app.use((err, req, res, next) =>{
    let{status = 500, message ="Something Went Wrong!"} = err;
    res.status(status).render("error.ejs", {message});

    // res.send("Something Went Wrong");
});

app.get("/", (req, res) =>{
    res.send("S");
})

app.listen(port, () =>{
    console.log("listening on port");
});

