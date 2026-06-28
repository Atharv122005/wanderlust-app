const express = require('express');
const router = express.Router();

let Listing = require("../models/listing.js")
let wrapAsync = require("../utils/wrapAsync.js");
let ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn ,isOwner , validateListing } = require("../middleware.js");


// index route
router.get("/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("./listing/index", { allListing });
  }))


// New Route
router.get("/new",
  isLoggedIn,
  (req, res) => {
    res.render("./listing/new")

  })

router.post("/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log(req.user);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'new listing is created !')
    // console.log(newListing);
    res.redirect("/listing");
  }))



//edit post
router.get("/:id/edit",
  isLoggedIn,
  isOwner,   
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let eachListing = await Listing.findById(id);
    res.render("./listing/edit", { eachListing });
  }))

router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // console.log(res);
    // if (!listing.owner.equals(res.locals.currUser._id)) {
    //   req.flash("error", "You don't have permission to edit");
    //   return res.redirect(`/listing/${id}`);
    // }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect("/listing");
  }))



// show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let eachListing = await Listing.findById(id).populate('reviews').populate('owner');
  console.log(eachListing);
  res.render("./listing/show", { data: eachListing });
}))


module.exports = router;
