const express  = require("express");
const router = express.Router();
const wrapAsync =require("../util/wrapAsync.js");
const {listingSchema , reviewSchema} =require("../schema.js");
const ExpressError =require("../util/ExpressError.js");
const Listing = require("../models/listing.js"); 
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const {storage}=require ("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })

const validateListing =(req,res,next)=>{
 let {error} = listingSchema.validate(req.body);
  
   if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }
   else { next();
   }
}


router.get("/",wrapAsync(listingController.index));
//new route
router.get("/new",isLoggedIn,(req,res)=>{

    res.render("listings/new.ejs");
});
router.get("/:id",wrapAsync(async(req,res)=>{
let{id}=req.params;
const listing =await Listing.findById(id).populate({ 
    path :"reviews",
   populate : {
    path : "author",
   }
}).populate("owner");
if(!listing){
     req.flash("error","Listing you requested doesn't exists!");
    return res.redirect("/listings");
}
res.render("listings/show.ejs",{listing});
}))
router.post("/",isLoggedIn ,upload.single('listing[image]'),  validateListing,wrapAsync(async(req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
 let url = req.file.path;
 let filename = req.file.filename;
    const newListing =new Listing(req.body.listing);
     newListing.owner = req.user._id ;
     newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing created successfully");
    res.redirect("/listings");
    
   
})
);

//edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing =await Listing.findById(id);  
    if(!listing){
     req.flash("error","Listing you requested doesn't exists!");
     return res.redirect("/listings");
}
    res.render("listings/edit.ejs",{listing}) ;
}))
router.put("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));
router.delete("/:id",  isLoggedIn ,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted");
    res.redirect("/listings");
}));

module.exports =router;