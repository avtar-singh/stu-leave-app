var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    Middleware = require("../middleware");

// SHOW ROUTE
router.get("/:id", Middleware.checkUserType, function (req, res) {
    User.findById(req.params.id).populate("letters").exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if(currentUser.role.toLowerCase().equals("student")){
                res.render("student/show", { student: data });
            }
        }
    });
});

module.exports = router;