if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
 
console.log(process.env) 
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/ wrapAsync.js");
const expressError=require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

    
}

app.listen(port,()=>{
    console.log("server working fine");
});


app.use(session({
    secret:"mysupersecretcode",
    saveUninitialzed:true,
    resave:false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);
app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found!"));
})
app.use((err,req,res,next)=>{
    let {statusCode=400,message="something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});
 
 