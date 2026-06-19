const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require("path");
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


const methodOverride = require('method-override');
app.use(methodOverride("_method"));

let port =8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

const viewsPath = path.join(__dirname, "views");
app.use(express.static(path.join(__dirname, "public"))); 

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const sessionOption ={
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}

app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); 
  res.locals.currUser = req.user;
  next();
})


// app.get("/demouser", async(req,res)=>{
//   try{
//     const fakeuser = new User({
//       email:"athrav34@gmail.com",
//       username:"atharv patil"
//     });

//     let registeredUser = await User.register(fakeuser,"atharv132");

//     res.send(registeredUser);

//   }catch(err){
//     console.log(err);
//     res.send(err.message);
//   }
// });


app.use('/listing', listingRouter);
app.use("/listing/:id/review" ,reviewRouter)
app.use("/" ,userRouter)



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