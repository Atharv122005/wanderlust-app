const express = require('express')
const app = express()
const path = require("path");

let port =8080;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const viewsPath = path.join(__dirname, "views");
const mongoose = require('mongoose');

let Listing =require("./models/listing.js")

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



// index route
app.get("/listing",async (req,res)=>{
  const allListing = await Listing.find({});
  // console.log(allListing);
  res.render("./listing/index",{allListing});
})


// New Route
app.get("/listing/new", (req,res)=>{
  res.render("./listing/new")
  
})

app.post("/listing", async (req,res)=>{
  const newListing =new Listing(req.body.listing);
  await newListing.save();
  console.log(newListing);
  res.redirect("/listing");


})



// show route
app.get("/listing/:id",async (req,res)=>{
  let {id} = req.params;
  let eachListing = await Listing.findById(id); 
  console.log(eachListing);
  res.render("./listing/show",{data :eachListing});
})


app.listen(port, () => {
  console.log(`Server is running on these ${port}`);
})