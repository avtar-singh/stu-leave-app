var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    role: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);