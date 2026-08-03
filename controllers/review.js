const Listing =require("../models/listing.js")
const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newListing = new Review(req.body.review);
  newListing.author = req.user._id; 
  await listing.reviews.push(newListing);
  console.log(newListing);
  await newListing.save();
  await listing.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyReview  = async(req,res,)=>{
  let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listing/${id}`);
}