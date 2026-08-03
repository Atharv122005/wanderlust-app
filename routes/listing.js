const express = require('express');
const router = express.Router();

let Listing = require("../models/listing.js")
let wrapAsync = require("../utils/wrapAsync.js");
let ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn ,isOwner , validateListing } = require("../middleware.js");
const listingController =require("../controllers/listing.js"); 

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage })


// index route
router.route("/")
.get(
  wrapAsync(listingController.index))
.post(
isLoggedIn,
upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing))




// New Route
router.get("/new",
  isLoggedIn,listingController.renderNewForm)

//   // create Route
// router.post("/",
//   validateListing,
//   wrapAsync(listingController.createListing))


//edit post
router.get("/:id/edit",
  isLoggedIn,
  isOwner,   
  wrapAsync(listingController.renderEditForm))


  // update route
router.route("/:id")
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing))

.get( wrapAsync(listingController.showListing))




// // show route
// router.get("/:id", wrapAsync(listingController.showListing))


module.exports = router;
