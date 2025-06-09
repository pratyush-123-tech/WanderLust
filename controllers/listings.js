const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const  geocodingClient =  mbxGeocoding({ accessToken:mapToken});
module.exports.index=async (req,res)=>{
    let listing=await Listing.find({});
    res.render("listings/index.ejs",{listing});
};
module.exports.renderNewForm=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");
         
    }
    else{
        res.render("listings/new.ejs");
    }
     
};
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:'reviews',populate:{path:"author"}},).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});

};
module.exports.createListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send()
    let {title,description,image,price,country,location}=req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing({title,description,image,price,country,location});
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created Successfully");
    res.redirect("/listings");
}
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}
module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,country,location}=req.body;
    let listing=await Listing.findByIdAndUpdate(id,{title,description,image,price,country,location});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
     
    req.flash("success"," Listing Updated Successfully");
    res.redirect(`/listings/${id}`);

};
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Deleted Successfully");
    res.redirect("/listings");
};