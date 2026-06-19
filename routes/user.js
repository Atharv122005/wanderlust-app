const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');

router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);

    req.login(registerUser, (err)=> {
      if (err) { 
        return next(err); 
      }
      
    
    req.flash("success", "Well come to Wanderlust!");
    res.redirect("/listing");
  });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup")
  }
}))

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
})

router.post('/login',
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  async (req, res) => {
    req.flash("success", "Login successful wellcome to WanderLust!")
    res.redirect('/listing');
  });


router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "logged you out!");
    let redirectUrl = res.locals.redirectUrl  || "/listing";
    res.redirect(redirectUrl);
  })
})

module.exports = router;