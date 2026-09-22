const Listing =require ("../models/listing");
module.exports.index = async(req,res)=>{
    let allListing =await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}