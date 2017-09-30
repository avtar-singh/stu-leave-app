var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    User        = require("../models/user"),
    Letter      = require("../models/letter"),
    Middleware  = require("../middleware");

// INDEX ROUTE
router.get("/", Middleware.isLoggedIn, function(req, res){  
        Letter.find({}, function(err, data){
            if(err){
                console.log(err);
            }else{
                if(res.locals.currentUser.role === "teacher"){
                    res.render("letter/index", {letter: data});
                }
            }
        });
  });

// NEW ROUTE
router.get("/new", Middleware.isLoggedIn, function(req, res){
    Letter.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        }else{
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
            res.redirect("/");
        }else{
            //CREATE NEW LETTER
            Letter.create(req.body.letter, function(err, letter){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }else{
                    if(req.user.role === "student"){
                        // add username and id to letter
                        letter.author.id = req.user._id;
                        letter.author.username = req.user.username;
                        letter.approvalStatus.status = false;
                        // save letter         
                        letter.save();
                        userData.letters.push(letter);
                        userData.save();
                        console.log(letter);
                        req.flash("success", "Successfully added letter");
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
            res.render("letter/approve", {letter: foundLetter, letid: req.params.letter_id});
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
                req.flash("error", "You are not authenticated to do this!");
                console.log(err);
            } else {
                req.flash("success", "Approved letter successfully!");
                res.redirect("/");
            }
        });
    }
});

module.exports = router;