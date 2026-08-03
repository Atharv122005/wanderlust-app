let Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("./listing/index", { allListing });
}

module.exports.renderEditForm =async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let eachListing = await Listing.findById(id);
    res.render("./listing/edit", { eachListing });
  }

module.exports.createListing = async (req, res, next) => {
    // console.log(req.user);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash('success', 'new listing is created !')
    // console.log(newListing);
    res.redirect("/listing");
  }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    let url = req.file.path;
    let filename = req.file.filename;
    if(typeof req.file !="undefine"){
      listing.image = {url,filename};

    }
    await listing.save();
    
    req.flash("success", "Listing updated successfully!");
    res.redirect("/listing");
  }

module.exports.showListing =async (req, res) => {
  let { id } = req.params;
  let eachListing = await Listing.findById(id).populate({path:'reviews',populate:{path:"author"},}).populate('owner');
  console.log(eachListing);
  res.render("./listing/show", { data: eachListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new")
  }