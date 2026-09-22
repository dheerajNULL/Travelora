const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require ("./util/ExpressError.js");

module.exports.isLoggedIn =(req,res,next) =>{
    if(! req.isAuthenticated()){
    req.flash("error","you must be logged in to create listing");
    return res.redirect("/login")
  }
  next();
}

module.exports.isOwner =async(req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you re not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuthor =async(req,res,next)=>{
  let {id ,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you re not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};