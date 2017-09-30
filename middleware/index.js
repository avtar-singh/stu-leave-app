var User   = require("../models/user"),
    Letter = require("../models/letter");

var middlewareObject = {};

// TO CHECK AUTHENTICITY OF USER - STUDENT
middlewareObject.checkIfStudent = function (req, res, next) {
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

// TO CHECK AUTHENTICITY OF USER - TEACHER
middlewareObject.checkIfTeacher = function (req, res, next) {
    if (req.isAuthenticated()) {
      User.findById(req.params.id, function (err, foundUser) {
        if (err) {
          req.flash("error", "User not found");
          res.redirect("back");
        } else {
          // Is User a Teacher?
          if (foundUser.role.toLowerCase().equals("teacher")){
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

// TO CHECK AUTHENTICITY OF LETTER ORIGIN
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

// FOR CHECKING IF USER IS LOGGED IN
middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");  
}

module.exports = middlewareObject;