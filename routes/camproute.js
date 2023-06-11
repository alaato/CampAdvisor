const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError')
const {Campground} = require('../models/campgrounds');
const {CampgroundSchema} = require('../Schemas/schemas');
const {isLogedIn, isAuthor} = require('../middleware/middlewares');
const multer = require('multer');
const {storage, cloudinary} = require('../CloudConfig')
const upload = multer({storage})


const ValidateCampground = function (req, res, next)
{
    
    const {error} = CampgroundSchema.validate(req.body)
    if(error)
    {
      throw new ExpressError(error.details[0].message, 400)
    }
    else
    {
      next();
    }
}

router.get('/', async (req, res, next)=>
{

  
    const allcampgrounds = await Campground.find({}).populate('author');
    res.render('Campgrounds/index', {allcampgrounds})
  

 
})
router.get('/new', isLogedIn ,(req, res)=>
{
  res.render('Campgrounds/new.ejs')
})

router.post('/',isLogedIn, upload.array('image'), ValidateCampground, CatchAsync(async (req, res)=>
{
  const camp = new Campground(req.body)
  camp.images = req.files.map(f=> ({url:f.path, filename:f.filename}))
  camp.author = req.user.id
  await camp.save();
  req.flash('success', 'Successfully added new campground')
  res.redirect(`/campgrounds/${camp.id}`)
}))

router.get('/:id', CatchAsync(async (req, res)=>
{
  const {id} = req.params
  const camp = await Campground.findById(id).populate({
    path:'reviews',
     populate:{ path:'author' }
  }).populate('author');

  res.render('Campgrounds/show', {camp})

}))


router.get('/:id/edit',isLogedIn, isAuthor ,CatchAsync(async (req, res)=>
{
try {
  const {id} = req.params
  const camp = await Campground.findById(id)
  res.render('Campgrounds/edit', {camp})
} catch (error) {
  console.error(error);
}
}))

router.put('/:id',isAuthor, upload.array('image'), ValidateCampground, CatchAsync(async(req, res)=>{
  try {
    const {id} = req.params
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(id,{...req.body})
    images = req.files.map(f=> ({url:f.path, filename:f.filename}))
    camp.images.push(...images)
    await camp.save()
    if(req.body.imagedelete)
    {
      for(let filename of req.body.imagedelete)
      {
        await cloudinary.uploader.destroy(filename);
      }
      await camp.updateOne({$pull: {images: {filename:{$in: req.body.imagedelete}}}})
    }

    res.redirect(`/campgrounds/${id}`)
  } catch (error) {
    console.error(error);
  }
  
}))

router.delete('/:id/delete',isAuthor, CatchAsync(async(req,res)=>{
  const {id} = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

module.exports = router;