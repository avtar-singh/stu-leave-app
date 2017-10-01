// REQUIRING DEPENDENCIES
var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

// CREATING NEW SCHEMA
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    letters: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Letter"
        }
    ]
});

// ADDING PASSPORT-LOCAL-MONGOOSE PLUGIN TO THIS SCHEMA
userSchema.plugin(passportLocalMongoose);

// EXPORTING REQUIRED MODEL
module.exports = mongoose.model("User", userSchema);