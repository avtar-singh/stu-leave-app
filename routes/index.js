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

    // DECLARING USERNAME VARIABLE
    var userData = new User({
            username: req.body.username,
            email: req.body.email, 
            role: req.body.role
    });
    User.register(userData, req.body.password, function(err, newUser){
        if(err){
            // ERROR MESSAGE
            req.flash("error", err.message);
            // REDIRECT TO REGISTER USER PAGE
            res.redirect("register");
        } 
        // AUTHENTICATE USER
        passport.authenticate("local")(req, res, function(){
            if(currentUser.role.toLowerCase().equals("student")){
                // SUCCESS MESSAGE
                req.flash("success", "Welcome to S.L.A.S.A " + newUser.username);
                // REDIRECT TO VIEW ALL STUDENT APPLICATIONS PAGE
                res.redirect("/student/" + newUser._id);
            } else if(currentUser.role.toLowerCase().equals("teacher")){
                // SUCCESS MESSAGE
                req.flash("success", "Welcome to S.L.A.S.A " + newUser.username);
                // REDIRECT TO VIEW ALL LETTER PAGE
                res.redirect("/letter");
            } else {
                // ERROR MESSAGE
                req.flash("error", "Please provide required role i.e student or teacher ");
                // REDIRECT TO LOGOUT PAGE
                res.redirect("/logout");
            }
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
        successRedirect: "/", 
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