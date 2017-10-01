// REQUIRING DEPENDENCIES
var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    User        = require("../models/user"),
    Middleware  = require("../middleware");

// SHOW ROUTE
router.get("/:id", function (req, res) {
    // CHECK IF USER IS STUDENT OR NOT
    if(res.locals.currentUser.role === "student"){
        User.findById(req.params.id).populate("letters").exec(function (err, data) {
            if (err) {
                // ERROR MESSAGE
                req.flash("error", "Sorry, You are not authenticated to do this.");
                // REDIRECT TO LANDING PAGE
                res.redirect("/");
            } else {
                res.render("student/show", { student: data });
            }
        });
    }
});

module.exports = router;