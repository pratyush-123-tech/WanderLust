const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/ wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
const validateListing=(req,res,next)=>{
    let {err}=listingSchema.validate(req.body);
    if(err){
        throw new expressError(300,"Specify all necessary details!");
    }
    else{
        next();
    }
}
router.get("/",wrapAsync(listingController.index));
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));
router.get("/:id",wrapAsync(listingController.showListing));
router.post("/",isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingController.createListing));
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
router.patch("/:id",isLoggedIn,upload.single("image"),isOwner,wrapAsync(listingController.editForm));
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
module.exports=router;