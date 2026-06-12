const express = require('express')
const app = express()
const path = require("path");
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
let ejsMate = require('ejs-mate');

let port =8080;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

const viewsPath = path.join(__dirname, "views");
const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, "public"))); 


let Listing =require("./models/listing.js")
const Review = require("./models/review");
let wrapAsync = require("./utils/wrapAsync.js");
let ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("./schema.js");

main()
.then((res)=>{
    console.log("connection succesful")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

app.get("/",(req,res)=>{
    res.send("working")
})


// listing
// app.get("/testListing", async (req,res)=>{
//  let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India"
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("working");
// })

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

// index route
app.get("/listing",
  wrapAsync(async (req,res)=>{
  const allListing = await Listing.find({});
  // console.log(allListing);
  res.render("./listing/index",{allListing});
}))


// New Route
app.get("/listing/new", (req,res)=>{
  res.render("./listing/new")
  
})

app.post("/listing", 
  validateListing,
  wrapAsync(async (req,res,next)=>{
  const newListing =new Listing(req.body.listing);
  await newListing.save();
  // console.log(newListing);
  res.redirect("/listing");
}))



// Review
// post route
app.post("/listing/:id/review", 
  validateReview,
  wrapAsync(async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newListing = new Review(req.body.review);
  await listing.reviews.push(newListing);
  console.log(newListing);
  await newListing.save();
  await listing.save();
  res.redirect(`/listing/${listing._id}`);
}))

//edit post
app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
  let {id} = req.params;
  // console.log(id);
  let eachListing = await Listing.findById(id); 
  res.render("./listing/edit",{eachListing});
}))

app.put("/listing/:id",
  validateListing,
  wrapAsync(async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect("/listing");
}))

// Delete Review Route
app.delete("/listing/:id/review/:reviewId",wrapAsync(async(req,res,)=>{
  let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listing/${id}`);
}))



// show route
app.get("/listing/:id",wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let eachListing = await Listing.findById(id). populate('reviews'); 
  console.log(eachListing);
  res.render("./listing/show",{data :eachListing});
}))

// middleware
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let {statusCode = 500 , message="something went wrong"} = err;
  res.status(statusCode);
  res.render("Error.ejs",{message})
});


app.listen(port, () => {
  console.log(`Server is running on these ${port}`);
})