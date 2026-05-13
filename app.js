const express = require('express')
const app = express()

let port =8080;

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
  const allListing = await Listing.findMany({});
  console.log(allListing);
  res.render("index",{allListing});
})

app.listen(port, () => {
  console.log(`Server is running on these ${port}`);
})