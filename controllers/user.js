

module.exports.signupForm = (req, res)=>{
    res.render("user.ejs");
};

module.exports.signup = async(req, res) =>{
    try{
    let {username , email, password} = req.body;
    const newUser = new User({email, username});
    await User.register(newUser, password);
    req.flash("success", "Welcome to WanderLust!");
    res.redirect("/listing");
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) =>{
    res.render("login.ejs");
};

module.exports.login = async(req, res) =>{
    req.flash("success" ,"Welcome Back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are LoggedOut!");
        res.redirect("/listing");
    });
};
