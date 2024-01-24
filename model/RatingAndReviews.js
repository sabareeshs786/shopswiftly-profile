const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingAndReviewSchema = new Schema({
    userid: {
        type: Number,
        required: true,
        unique: true
    },
    skuid: {
        type: Number,
    },
    review: {
        type: String
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    }
});

const RatingAndReview = mongoose.model('RatingAndReview', RatingAndReviewSchema, 'ratingsandreviews');

module.exports = RatingAndReview;