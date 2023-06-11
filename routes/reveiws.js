const express = require('express');
const router = express.Router({mergeParams: true});
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError')
const {Campground} = require('../models/campgrounds');
const {reviewSchema} = require('../Schemas/schemas');
const Review = require('../models/review');
const {isLogedIn, isAuthor} = require('../middleware/middlewares');
const ValidateReview = function (req, res, next)
{
    
    const {error} = reviewSchema.validate(req.body)
    if(error)
    {
      throw new ExpressError(error.details[0].message, 400)
    }
    else
    {
      next();
    }
}

router.post('', isLogedIn, ValidateReview, CatchAsync(async (req, res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    const review = new Review(req.body)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campgrounds/${id}`)
    
  }))
  router.delete('/:review_id',isLogedIn, isAuthor, CatchAsync(async(req,res)=>{
    const {id, review_id} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: review_id}})
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/campgrounds/${id}`);
  })
  )
  module.exports = router;