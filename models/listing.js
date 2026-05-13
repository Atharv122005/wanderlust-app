const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
         default: "https://www.istockphoto.com/stock-photos/nature-and-landscapes",
        set:(v)=>
            v===""?"https://www.istockphoto.com/stock-photos/nature-and-landscapes":v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;