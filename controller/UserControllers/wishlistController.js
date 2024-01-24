const Wishlist = require('../../models/Wishlist');

const getItemsFromWishlist = async (req, res) => {
    const userid = req?.params?.userid;
    if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
    const fields = ['-id', '-createdAt', '-updatedAt', '-__v', '-userid'];
    try {
        const wishlist = await Wishlist.find({ userid }).select(fields.join(' '));
        res.status(201).json(wishlist);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const addItemToWishlist = async (req, res) => {
    const userid = req?.params?.userid;
    const { skuid, imageFileNames, pname, sp, mp, 
        offer, availability, rating, noOfRatings 
    } = req.body;
    const reqFields = { skuid, imageFileNames, pname, sp, mp, 
        offer, availability 
    }
}