var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    User        = require("../models/user"),
    Letter      = require("../models/letter"),
    Middleware  = require("../middleware");

// INDEX ROUTE
router.get("/", Middleware.isLoggedIn, Middleware.checkIfTeacher, function(req, res){  
        Letter.find({}, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.render("letter/index", {user: data});
            }
        });
  });

// NEW ROUTE
router.get("/new", Middleware.isLoggedIn, Middleware.checkIfStudent, function(req, res){
    Letter.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        }else{
            res.render("letter/new", {letter: data});
        }
    });
});

// POST ROUTE
router.post("/", Middleware.isLoggedIn, Middleware.checkIfStudent, function(req, res){
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

// UPDATE ROUTE
router.put("/:letter_id", Middleware.checkIfTeacher, Middleware.checkLetterOrigin, function(req, res){
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
});

module.exports = router;