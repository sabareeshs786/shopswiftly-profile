const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Wishlist = require('../../models/Wishlist');
const EmailVerificationCodes = require('../../models/EmailVC');
const FPasswordVerificationCodes = require('../../models/FPasswordVC');

const mongoose = require('mongoose');

const handleEmailVerification = async (req, res) => {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const email = req.body?.email;
        const code = req.body?.code;
        if(!email || !code) throw {code: 400, message: "Invalid email id or verification code"};

        const result = await EmailVerificationCodes.findOne({email}).exec();
        const user = await User.findOne({email}).exec();

        if(!user)
            throw {code: 400, message: "Invalid email id"};
        if(user.verified)
            throw {code: 200, message: "Email already verified"};
        if(!result)
            throw {code: 400, message: "Verification code expired"};

        const userid = user.userid;

        if(result?.code === code){
            const updateduser = await User.updateOne(
                { userid },
                {   
                    $set: {
                        verified: true
                    }
                },
                { session }
            ).exec();

            const profile = await Profile.create([{
                userid,
            }], { session });
            const wishlist = await Wishlist.create([{
                userid
            }], { session });
            const emailVerification = await EmailVerificationCodes.deleteOne({email});

            await session.commitTransaction();
            res.status(201).json({ message: `Email verified successfully` });
        }
        else
            throw {code: 400, message: "Invalid verification code entered"};

    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        if(err.code && err.message)
            res.status(err.code).json({'message': err.message});
        else
            res.status(500).json({ 'message': "Internal server error occurred!!!\n Try again later" });
    }
    finally{
        if (session) {
            session.endSession();
        }
    }
}

const handleForgotPasswordCode = async (req, res) => {
    try {
        const email = req.body?.email;
        if(!email) return res.status(400).json({message: "Invalid input data"});

        const user = await User.findOne({email}).exec();
        if(!user) return res.status(400).json({message: "Invalid email address entered"});
        
    } catch (error) {
        
    }    
}

const handleResendVC = async (req, res) => {
    const email = req.body?.email;
    const purpose = req.body?.purpose;
    try {
        const purposes = ["email", "password"];
        if(!email || !purpose || !purposes.includes(purpose)) return res.status(400).json({message: "Invalid input data"});

        const user = await User.findOne({email}).exec();
        if(!user) return res.status(400).json({message: "Invalid email address entered"});

        let verCodeCollection;

        if(purpose === "email"){
            if(user.verified) return res.status(200).json({message: "Email id already verified"});
            verCodeCollection = EmailVerificationCodes;
        }
        else{
            verCodeCollection = FPasswordVerificationCodes;
        }

        const result = await verCodeCollection.findOneAndDelete({ email });
        if (result) {
            console.log('Document deleted successfully');
        } else {
            console.log('Document not found');
        }

        // Generate new verification code
        const code = generateVerificationCode();
        const isSent = await sendEmail(email, "Verification code", `Your email verification code is ${code}`);

        if(!isSent)
            throw {message: "Can't send email"};

        await verCodeCollection.create([{
            "email": email,
            "code": code
        }]).exec();

        return res.status(200).json({message: "Verification code sent successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'message': "Internal server error occurred!!!\n Try again later" });
    }
}

module.exports = { handleEmailVerification, handleForgotPasswordCode, handleResendVC };