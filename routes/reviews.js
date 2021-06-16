const express = require('express')
const router = express.Router({ mergeParams: true });
// merge params gives you access to the id in params which otherwise you wouldn't have.
const catchAsync = require('../utils/catchAsyn')
const Review = require('../models/review')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('../joischema')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')





router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router
