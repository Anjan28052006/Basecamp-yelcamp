const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schema');
const methodOverride = require('method-override');
const catchAsync = require('../utils/catchAysnc');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../module/campground');
const { isLoggedin, areYouAuthor, validateCampground } = require('../middleware')
const campgrounds=require('../controllers/campgrounds')
const multer  = require('multer')
const {storage}=require('../cloudinary/index')
const upload = multer({ storage});  //diffcult to remember;;



router.get('/new', isLoggedin, catchAsync(campgrounds.newForm));

router.route('/')
      .get( catchAsync(campgrounds.indexPage))
      .post( isLoggedin, validateCampground,upload.array('image'), catchAsync(campgrounds.createNew))
    //   .post( upload.single('image'),(req,res)=>{
    //     console.log(req.body,req.file)
    //     res.send('it worked');
    //   })
//     .post((req, res, next) => {
//     console.log("Before multer");
//     next();
// }, upload.array('image'), (req, res) => {
//     console.log("After multer");
//     console.log(req.body, req.files);
//     res.send("it worked");
// })


router.route('/:id')
      .put( isLoggedin, areYouAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.update))
      .get(catchAsync(campgrounds.show));
     
router.get('/:id/edit', areYouAuthor, catchAsync(campgrounds.findForUpdate));

router.delete('/:id/delete', isLoggedin, areYouAuthor, catchAsync(campgrounds.delete));

module.exports = router;
