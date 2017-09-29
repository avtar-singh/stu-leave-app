var Letter = require("../models/letter");

var middlewareObject = {};

middlewareObject.checkUserType = function (req, res, next) {
    if (req.isAuthenticated()) {
      User.findById(req.params.id, function (err, foundUser) {
        if (err) {
          req.flash("error", "User not found");
          res.redirect("back");
        } else {
          // Is User a Student?
          if (foundUser.role.toLowerCase().equals("student")) {
            next();
          }
          // Is User a Teacher?
          else if (foundUser.role.toLowerCase().equals("teacher")){
              next();
          }
          // Not Found?
          else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
        res.redirect("back");
    }
  }
middlewareObject.checkLetterOrigin = function(req, res, next){
    if(req.isAuthenticated()){
        Letter.findById(req.params.letter_id, function(err, foundLetter){
        if(err){
            res.redirect("back");
        } else {
            // Did the student write this letter?
            if(foundLetter.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "Please Log In First!");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");  
}

module.exports = middlewareObject;