// REQUIRING DEPENDENCIES
var express   = require("express"),
    router    = express.Router(),
    passport  = require("passport"),
    User      = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

// REGISTER FORM
router.get("/register", function(req, res){
    res.render("register");
});

// SIGN UP LOGIC
router.post("/register", function(req, res){
    var uName = new User({username: req.body.username});
    User.register(uName, req.body.password, function(err, newUser){
        if(err){
            // ERROR MESSAGE
            req.flash("error", err.message);
            // REDIRECT TO REGISTER USER PAGE
            res.redirect("register");
        } 
        // AUTHENTICATE USER
        passport.authenticate("local")(req, res, function(){
            // SUCCESS MESSAGE
            req.flash("success", "Welcome to S.L.A.S.A " + newUser.username);
            // REDIRECT TO VIEW ALL LETTERS PAGE
            res.redirect("/letters");
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

// SIGN IN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/letter", 
        failureRedirect: "/login"
    }),
    function(req, res){
});

// LOGOUT FORM
router.get("/logout", function(req, res){
    req.logout();
    // SUCCESS MESSAGE
    req.flash("success", "Successfully Logged Out!");
    // REDIRECT TO LANDING PAGE
    res.redirect("/");
});

module.exports = router;