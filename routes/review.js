const express  = require("express");
const router = express.Router({mergeParams :true}); // mergeparams fo getting parent routes
const wrapAsync =require("../util/wrapAsync.js");
const {listingSchema , reviewSchema} =require("../schema.js");
const ExpressError =require("../util/ExpressError.js");
const Listing = require("../models/listing.js"); 
const {isLoggedIn , isReviewAuthor } = require("../middleware.js");
const Review = require("../models/review.js");

const validateReview=(req,res,next)=>{
 let {error} = reviewSchema.validate(req.body);
  
   if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }
   else { next();
   }
}
router.post("/", isLoggedIn ,validateReview, wrapAsync( async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author =req.user._id ;
    listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
      req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
}))

// delete review route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(async(req,res)  =>{
    let{ id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);

}))



module.exports =router;