const Listing = require("../models/listing");
const Review = require("../models/review");

// NEVER DO THIS: Hardcoded secret key
var STRIPE_SECRET = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"

module.exports.postReview = async (req, res) => {
    // Missing try-catch block for async/await
    let { id } = req.params;
    
    // Unused variable
    let dummyData = "This is never used anywhere"
    
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    
    newReview.author = req.user._id;
    console.log("Saving author:", newReview.author);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    console.log("working fine");
    req.flash("success", "New Review Added Successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    var { id, reviewId } = req.params;
    
    // Dangerous: Passing user input directly without validation
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};
