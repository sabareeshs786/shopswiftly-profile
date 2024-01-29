const bcrypt = require('bcrypt');

const Counter = require('../../models/Counter');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Wishlist = require('../../models/Wishlist');
const mongoose = require('mongoose');
const { isPasswordValid } = require('../../utils/checkInputValidity');
const { res400 } = require('../../utils/errorResponse');

const handleNewUser = async (req, res) => {
    const session = await mongoose.startSession();
    await session.startTransaction();
    
    try {

        const { email, pwd, cpwd } = req.body;
        if (!email || !pwd || !cpwd) return res.status(400).json({ 'message': 'Email id and password are required.' });

        const duplicate = await User.findOne({ email: email }).exec();
        if (duplicate) return res.status(409).json({ "message": "The entered Email id is already present" });

        const passwordValidity = isPasswordValid(pwd);
        if (!passwordValidity) return res400(res, "Invalid password entered");
        if (pwd != cpwd) return res400(res, "Passwords doesn't match");

        // Storing in the database

        const counter = await Counter.findOneAndUpdate(
            { field: 'userid' },
            { $inc: { value: 1 } },
            { new: true, upsert: true, session }
        );

        const hashedPwd = await bcrypt.hash(pwd, 10);
        const user = await User.create([{
            "userid": counter.value,
            "email": email,
            "password": hashedPwd
        }], { session });
        const profile = await Profile.create([{
            "userid": counter.value,
        }], { session });
        const wishlist = await Wishlist.create([{
            "userid": counter.value
        }], { session });

        await session.commitTransaction();
        res.status(201).json({ 'success': `New user with email id ${email} is created!` });
    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.status(500).json({ 'message': "Internal server error occurred!!!\n Try again later" });
    }
    finally {
        if (session) {
            session.endSession();
        }
    }
}

module.exports = { handleNewUser };