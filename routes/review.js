const express = require('express')
const router = express.Router({ mergeParams: true });

const Listing =require("../models/listing.js")
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const { validateReview } = require("../middleware.js");



// Review
// post route
router.post("/", 
  validateReview,
  wrapAsync(async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newListing = new Review(req.body.review);
  await listing.reviews.push(newListing);
  console.log(newListing);
  await newListing.save();
  await listing.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listing/${listing._id}`);
}))


// Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res,)=>{
  let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listing/${id}`);
}))

module.exports = router;