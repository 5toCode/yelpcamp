var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground	= require("./models/campground"),
	Comment		= require("./models/comment"),
	User 		= require("./models/user"),
	path		= require("path"),
	seedDB		= require("./seeds");
const mongoose  = require('mongoose');

// requiring routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");


mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

// PASSPORT config
app.use(require("express-session")({
	secret: "Lucy is the best dog in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() { 
  console.log('YelpCamp app listening on port 3000'); 
});