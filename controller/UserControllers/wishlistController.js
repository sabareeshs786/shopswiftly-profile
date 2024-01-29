const Wishlist = require('../../models/Wishlist');
const { removeEmptyFields, isvalidInputData, getIntVal } = require('../../utils/utilFunctions');

const getItemsFromWishlist = async (req, res) => {
    const userid = req.userid;
    if (!Number.isInteger(userid)) return res.status(400).json({ "message": 'Invalid input data' });

    const excludedFields = ['-id', '-createdAt', '-updatedAt', '-__v', '-userid'];
    try {
        const wishlist = await Wishlist.find({ userid }).select(excludedFields.join(' '));
        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500);
    }
}

const addItemToWishlist = async (req, res) => {
    try {
        const userid = req.userid;
        if (!Number.isInteger(userid)) return res.status(400).json({ "message": 'Invalid input data' });
        let { skuid } = req.body;

        const fields = { userid, };
        const wishlist = await Wishlist.create(fields);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteItemFromWishlist = async (req, res) => {
    const userid = req.userid;
    if (!Number.isInteger(userid)) return res.status(400).json({ "message": 'Invalid input data' });

}

module.exports = {
    getItemsFromWishlist,
    addItemToWishlist,
    deleteItemInWishlist: deleteItemFromWishlist
}