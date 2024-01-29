const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    userid: {
        type: Number,
        required: true,
        unique: true
    },
    skuid: {
        type: [Number],
        required: true
    }
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;