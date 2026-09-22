 
 if(
    process.env.NODE_ENV != "production"
 ){
 require('dotenv').config()
 }

const express =require("express");
const app =express();
const mongoose =require("mongoose");
// const Listing = require("./models/listing.js"); 
const path=require("path");
const ejsMate =require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
// const wrapAsync =require("./util/wrapAsync.js");
const ExpressError =require("./util/ExpressError.js");
//const {listingSchema , reviewSchema} =require("./schema.js");
//const Review = require("./models/review.js"); 
const listingRouter= require("./routes/lisitng.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js")
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));

const dbUrl = process.env.ATLASDB_URL ;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});
const sessionOptions = {
    store,
    secret : process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.get("/",(req,res)=>{
    res.redirect("/signup");

   })
;

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
res.locals.success =req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user ;
next();
})


async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("connected to server");
})
.catch((err)=>{
    console.log(err);
})
// app.get("/testsampling",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:" My new villa ",
//         description:"By the beach",
//         price:12000,
//         location:"kolkata,WB",
//         country :"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// });


app.use("/listings/:id/reviews",reviewRouter);
app.use("/listings",listingRouter);
app.use("/",userRouter);
// app.get("/listings",wrapAsync(async(req,res)=>{
//     let allListing =await Listing.find({});
//     res.render("listings/index.ejs",{allListing});
// }));
// //new route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");
// });
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
// let{id}=req.params;
// const listing =await Listing.findById(id).populate("reviews");
// res.render("listings/show.ejs",{listing});
// }))
// app.post("/listings", validateListing,wrapAsync(async(req,res,next)=>{
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"send valid data for listing");
//     // }
  
//     const newListing =new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
    
   
// })
// );
// //edit route
// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//     const listing =await Listing.findById(id);  
//     res.render("listings/edit.ejs",{listing}) ;
// }))
// //update route
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//      await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect("/listings");
// }));
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let{id}=req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs",{message});
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});