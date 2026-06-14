const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require("path");
let ejsMate = require('ejs-mate');

const methodOverride = require('method-override');
app.use(methodOverride("_method"));

let port =8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

const viewsPath = path.join(__dirname, "views");
app.use(express.static(path.join(__dirname, "public"))); 

const listing = require("./routes/listing.js");
const review = require("./routes/review.js")

app.use('/listing', listing);
app.use("/listing/:id/review" ,review)


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