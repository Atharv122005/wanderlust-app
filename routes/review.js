const express = require('express')
const router = express.Router({ mergeParams: true });

let Listing =require("../models/listing.js")
const Review = require("../models/review");
let wrapAsync = require("../utils/wrapAsync.js");
let ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");

const validateReview =(req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  // console.log(error);
  if(error){
    let errMsg = error.details.map(el=>el.message);
    throw new ExpressError(400, error.message);
  }else{
    next();
  }
}


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