const Campground = require('../models/campgrounds');
const Review = require('../models/review');

const isAuthor = async(req, res, next) => {
const {id,review_id} = req.params;
const campground = await Campground.findById(id)
if(req.user && campground.author.equals(req.user.id)){
  if(review_id){
    const review = await Review.findById(review_id);
    if(review.author.equals(req.user.id)){
      next();
    } else
    {
      req.flash('error', 'You do not have permission to do that');
      res.redirect(`/campgrounds/${id}`);
    }  
  }
  else {
    next();

  }
}
  else{
    req.flash('error', 'You do not have permission to do that');
    res.redirect(`/campgrounds/${id}`);
  }
}


 const isLogedIn = (req,res,next) => {
    
    if(!res.locals.isLoggedIn){
        req.flash('error', 'You must be logged in');
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    }
    else
    {
      next();
    }
}
 const isnotLogedIn = (req,res,next) => {
    console.log(res.locals.isLoggedIn);
    if(res.locals.isLoggedIn){
        res.redirect('/campgrounds');
    }
    else
    {
      next();
    }
}

module.exports = { isLogedIn, isnotLogedIn, isAuthor }