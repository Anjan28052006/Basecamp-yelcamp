const express=require('express');
const router=express.Router({ mergeParams: true });
const {campgroundSchema,reviewSchema}=require('../schema');
const methodOverride=require('method-override');
const catchAsync=require('../utils/catchAysnc');
const ExpressError=require('../utils/ExpressError');
const Campground = require('../module/campground');
const Review=require('../module/reveiws');
const {isLoggedin,validateReview,areYouReviewAuthor}=require('../middleware');
const reviews=require('../controllers/reviews');




router.delete('/:reviewid',isLoggedin,areYouReviewAuthor,catchAsync(reviews.deleteReview));

router.post('/',isLoggedin,validateReview,catchAsync(reviews.addNewReview));

module.exports=router;