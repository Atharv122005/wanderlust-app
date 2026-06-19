const express = require('express');
const router = express.Router();

let Listing =require("../models/listing.js")
let wrapAsync = require("../utils/wrapAsync.js");
let ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");




const validateListing =(req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  // console.log(error);
  if(error){
    let errMsg = error.details.map(el=>el.message);
    throw new ExpressError(400, error.message);
  }else{
    next();
  }
}


// index route
router.get("/",
  wrapAsync(async (req,res)=>{
  const allListing = await Listing.find({});
  // console.log(allListing);
  res.render("./listing/index",{allListing});
}))


// New Route
router.get("/new",
  isLoggedIn,
  (req,res)=>{
  res.render("./listing/new")
  
})

router.post("/", 
  validateListing,
  wrapAsync(async (req,res,next)=>{
  const newListing =new Listing(req.body.listing);
  await newListing.save();
  req.flash('success', 'new listing is created !')
  // console.log(newListing);
  res.redirect("/listing");
}))



//edit post
router.get("/:id/edit",
  isLoggedIn,
  wrapAsync(async (req,res)=>{
  let {id} = req.params;
  // console.log(id);
  let eachListing = await Listing.findById(id); 
  res.render("./listing/edit",{eachListing});
}))

router.put("/:id",
  validateListing,
  wrapAsync(async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success", "Listing updated successfully!");
  res.redirect("/listing");
}))



// show route
router.get("/:id",wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let eachListing = await Listing.findById(id). populate('reviews'); 
  console.log(eachListing);
  res.render("./listing/show",{data :eachListing});
}))


module.exports =router;
