const Listing=require("./models/listing");
const Review=require("./models/review");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in perform this task");
        return res.redirect("/login");
         
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error","you do not have access to perform this task");
        return res.redirect(`/listings/${id}`);
        
    }
    next();
}
module.exports.isReviewAuthor=(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=Review.findById(reviewId);
    if(res.locals.currUser && !res.locals.currUser._id.equals(review.author)){
        req.flash("error","you do not have access to perform this task");
        return res.redirect(`/listings/${id}`);
        
    }
    next();
}
