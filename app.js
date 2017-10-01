// REQUIRING NPM PACKAGES AND OTHER DEPENDENCIES
var express       = require("express"),
    bodyParser    = require("body-parser"),
    app           = express(),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    flash         = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOveride = require("method-override"),
    User          = require("./models/user"),
    Letter        = require("./models/letter"),
    seedDB        = require("./seeds");

// REQUIRING ROUTES
var studentRoute  = require("./routes/student"),
    letterRoute   = require("./routes/letters"),
    indexRoute    = require("./routes/index");

// CONNECT TO MONGODB
var url           = process.env.DATABASEURL || "mongodb://localhost/stu_leave_app";
mongoose.connect(url);

// USING IMPORTANT THINGS
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB(); //seeding the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
secret: "This is my only version!",
resave: false,
saveUninitialized: true
}));

// USING PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL VAR DECLERATIONS
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// USING ROUTES
app.use("/", indexRoute);
app.use("/student", studentRoute);
app.use("/letter", letterRoute);

// UNDEFINED ROUTE
app.get("*", function(req, res){
    res.send("Sorry, The Page you requested couldn't be found!");
  });

// LISTEN REQUESTS
app.listen(process.env.PORT, process.env.ID, function(){
  console.log("The stu-leave-app Server has started!!!");
});