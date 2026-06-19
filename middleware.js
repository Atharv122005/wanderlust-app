module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req);
        req.flash("error" ,"you must be login to createa Listing!")
        return res.redirect("/login")
    }
    next();

}
module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirecturl = req.session.redirectUrl;
    }
    next();
}