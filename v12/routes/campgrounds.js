var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// index route
router.get("/", function(req, res){
	// 	Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}		
	});
});

// create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
    var newCampground = {name: name,  price: price, image: image, description: desc, author: author}
	//create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// show form to create campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// show more info about one campground
router.get("/:id", function(req, res){
	// find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			// render show template with that campground 	
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground not found");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground deleted!");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;