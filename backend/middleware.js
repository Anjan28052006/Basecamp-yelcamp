const Campground = require("./module/campground");
const Review = require('./module/reveiws')
const { campgroundSchema, reviewSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: true, status: 401, message: 'you must be signed in' });
    }
    next();
}

module.exports.areYouAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        return res.status(404).json({ error: true, status: 404, message: 'Campground not found' });
    }
    if (!campground.author || !campground.author.equals(req.user._id)) {
        return res.status(403).json({ error: true, status: 403, message: 'you are not allowed to do that' });
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return res.status(402).json({ error: true, status: 402, message: msg });
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return res.status(402).json({ error: true, status: 402, message: msg });
    }
    next();
}

module.exports.areYouReviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review) {
        return res.status(404).json({ error: true, status: 404, message: 'Review not found' });
    }
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ error: true, status: 403, message: 'that is not your review' });
    }
    next();
}
