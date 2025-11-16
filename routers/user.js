const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const router = express.Router();
const userControllers = require("../controllers/user.js");

router.get("/signup", userControllers.signupForm);

router.post("/signup", wrapAsync(userControllers.signup));

router.get("/login", userControllers.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect : "/login",
    failureFlash : true,
}), userControllers.login);

router.get("/logout", userControllers.logout);

module.exports = router;


