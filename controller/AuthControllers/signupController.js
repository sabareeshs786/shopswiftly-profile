const bcrypt = require('bcrypt');

const Counter = require('../../model/Counter');
const User = require('../../model/User');
const { isPasswordValid } = require('../../utils/checkInputValidity');
const { res400 } = require('../../utils/errorResponse');

const handleNewUser = async (req, res) => {
    const { email, pwd, cpwd } = req.body;
    if (!email || !pwd || !cpwd) return res.status(400).json({ 'message': 'Email id and password are required.' });

    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.status(409).json({"message": "The entered Email id is already present"});

    const passwordValidity = isPasswordValid(pwd);
    if(!passwordValidity) return res400(res, "Invalid password entered");
    if(pwd != cpwd) return res400(res, "Passwords doesn't match");

    try {
        const counter = await Counter.findOneAndUpdate(
            { field: 'userid' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
          );
        
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const result = await User.create({
            "userid": counter.value,
            "email": email,
            "password": hashedPwd
        });
        
        res.status(201).json({ 'success': `New user with email id ${email} is created!` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': "Internal server error occurred!!!\n Try again later" });
    }
}

module.exports = { handleNewUser };