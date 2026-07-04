const Campground = require('../module/campground');
const Review = require('../module/reveiws');

module.exports.addNewReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        return res.status(404).json({ error: true, status: 404, message: 'Campground not found' });
    }
    const review = new Review(req.body.review);
    if (review.rating == 0) {
        return res.status(400).json({ error: true, status: 400, message: 'Rating must be greater than zero' });
    }
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    await review.populate('author');
    res.status(201).json({ message: 'Successfully added new review', review });
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    res.json({ message: 'deleted the review' });
}
