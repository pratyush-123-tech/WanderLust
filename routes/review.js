const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/ wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {listingSchema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews");
const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        throw new expressError(300,"Specify all necessary details!");
    }
    else{
        next();
    }
}
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;