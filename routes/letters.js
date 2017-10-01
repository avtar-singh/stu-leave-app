// REQUIRING DEPENDENCIES
var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    User        = require("../models/user"),
    Letter      = require("../models/letter"),
    Middleware  = require("../middleware");

// INDEX ROUTE
router.get("/", Middleware.isLoggedIn, function(req, res){  
        Letter.find({}, function(err, data){
            if(err){
                // ERROR MESSAGE
                req.flash("error", "Sorry, You are not authenticated to do this.");
                // REDIRECT TO LANDING PAGE
                res.redirect("/");
            }else{
                // CHECK IF USER IS TEACHER OR NOT
                if(res.locals.currentUser.role === "teacher"){
                    // RENDER INDEX PAGE
                    res.render("letter/index", {letter: data});
                }
            }
        });
  });

// NEW ROUTE
router.get("/new", Middleware.isLoggedIn, function(req, res){
    Letter.findById(req.params.id, function(err, data){
        if(err){
            // ERROR MESSAGE
            req.flash("error", "Sorry, You are not authenticated to do this.");
            // REDIRECT TO LANDING PAGE
            res.redirect("/");
        }else{
            // CHECK IF USER IS STUDENT OR NOT
            if(res.locals.currentUser.role === "student"){
                res.render("letter/new", {letter: data});
            }
        }
    });
});

// POST ROUTE
router.post("/", Middleware.isLoggedIn, function(req, res){
    //lookup student using id
    User.findById(res.locals.currentUser.id, function(err, userData){
        console.log("This is it "+ res.locals.currentUser.id);
        if(err){
            // ERROR MESSAGE
            req.flash("error", "You are not authenticated to do this!");
            // REDIRECT TO LANDING PAGE
            res.redirect("/");
        }else{
            //CREATE NEW LETTER
            Letter.create(req.body.letter, function(err, letter){
                if(err){
                    // ERROR MESSAGE
                    req.flash("error", "Something went wrong!");
                    // REDIRECT TO LANDING PAGE
                    res.redirect("/");
                }else{
                    if(req.user.role === "student"){
                        // ADD USERNAME AND ID TO LETTER
                        letter.author.id = req.user._id;
                        letter.author.username = req.user.username;
                        letter.approvalStatus.status = false;
                        // SAVE LETTER       
                        letter.save();
                        // PUSH CONTENT OF LETTER INTO REQUIRED STUDENT
                        userData.letters.push(letter);
                        userData.save();
                        console.log(letter);
                        //SUCCESS MESSAGE
                        req.flash("success", "Successfully added letter");
                        // REDIRECT TO STUDENT HOME PAGE
                        res.redirect('/student/' + req.user._id);
                    }
                }               
            });
        }
    });
});

// EDIT ROUTE - FOR APPROVAL OF LETTERS
router.get("/:letter_id/edit", function(req, res){
    // CHECK IF USER IS TEACHER OR NOT
    if(res.locals.currentUser.role === "teacher"){
        Letter.findById(req.params.letter_id, function(err, foundLetter){
            if(err){
                // ERROR MESSAGE
                req.flash("error", "You are not authenticated to do this!");
                // REDIRECT TO LANDING PAGE
                res.redirect("/");                
            }else{
                res.render("letter/approve", {letter: foundLetter, letid: req.params.letter_id});
            }
        });
    }
});

// UPDATE ROUTE
router.put("/:letter_id", function(req, res){
    // CHECK IF USER IS TEACHER OR NOT
    if(res.locals.currentUser.role === "teacher"){
        //find and update the correct letter
        Letter.findByIdAndUpdate(req.params.letter_id, req.body.letter, function(err, uLetter){
            if(err){
                // ERROR MESSAGE
                req.flash("error", "You are not authenticated to do this!");
                // REDIRECT TO LANDING PAGE
                res.redirect("/");
            } else {
                // SUCCESS MESSAGE
                req.flash("success", "Approved letter successfully!");
                // REDIRECT TO LANDING PAGE
                res.redirect("/");
            }
        });
    }
});

module.exports = router;