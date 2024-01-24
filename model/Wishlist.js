const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    userid: {
        type: Number,
        required: true,
        unique: true
    },
    skuid: {
        type: String,
        required: true
    },
    imageFileNames: {
        type: [String],
        required: true
    },
    pname: {
        type: String,
        required: true
    },
    sp: {
        type: Number,
        required: true,
    },
    mp: {
        type: Number,
        required: true
    },
    offer: {
        type: Number,
        required: true
    },
    availability:{
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        enum: [1,2,3,4,5],
        default: null
    },
    noOfRatings: {
        type: Number,
        default: 0
    }
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;