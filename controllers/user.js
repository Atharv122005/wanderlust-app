
const User = require("../models/user.js");

module.exports.signup = async (req, res) => {
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
}


module.exports.renderSignupForm = async (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Login successful wellcome to WanderLust!")
    res.redirect('/listing');
  }

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "logged you out!");
    let redirectUrl = res.locals.redirectUrl  || "/listing";
    res.redirect(redirectUrl);
  })
}