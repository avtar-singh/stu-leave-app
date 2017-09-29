var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    User        = require("../models/user"),
    Letter      = require("../models/letter"),
    Middleware  = require("../middleware");

// NEW ROUTE
router.get("/new", Middleware.isLoggedIn, function(req, res){
    Letter.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        }else{
            res.render("letter/new", {letter: data});
        }
    });
});

// POST ROUTE
router.post("/", Middleware.isLoggedIn, function(req, res){
    //CREATE NEW LETTER
    Letter.create(req.body.letter, function(err, letter){
        if(err){
            req.flash("error", "Something went wrong!");
            console.log(err);
        }else{
            // add username and id to letter
            letter.author.id = req.user._id;
            letter.author.username = req.user.username;
            // save letter         
            letter.save();
            user.letters.push(letter);
            user.save();
            console.log(letter);
            req.flash("success", "Successfully added letter");
            res.redirect('/student/' + user._id); 
        }               
    });
});

// EDIT ROUTE
router.get("/:letter_id/edit", Middleware.checkLetterOrigin, function(req, res){
    Letter.findById(req.params.letter_id, function(err, foundLetter){
        if(err){
            res.redirect("back");
        } else {
            res.render("letter/edit", {user_id: req.params.id, letter: foundLetter});
        }
    });  
});

// UPDATE ROUTE
router.put("/:letter_id", Middleware.checkLetterOrigin, function(req, res){
    if(currentUser.role.toLowerCase().equals("teacher")){
        //find and update the correct letter
        Letter.findByIdAndUpdate(req.params.letter_id, req.body.letter, function(err, uLetter){
            if(err){
                req.flash("error", "You are not authenticated to do this!");
                console.log(err);
            } else {
                req.flash("success", "Approved letter successfully!");
                res.redirect("back");
            }
        }); 
    } 
});

// DELETE ROUTE
router.delete("/:letter_id", Middleware.checkLetterOrigin, function(req, res){
    if(currentUser.role.toLowerCase().equals("teacher")){
        Letter.findByIdAndRemove(req.params.letter_id, function(err){
            if(err){
                req.flash("error", "You are not authenticated to do this!");
                console.log(err);
            } else {
                req.flash("success", "Letter deleted");
                res.redirect("back");
            }
        }); 
    } 
});

module.exports = router;