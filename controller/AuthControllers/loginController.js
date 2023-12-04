const User = require('../../model/User');
const bcrypt = require('bcrypt');
const { getAccessToken, getRefreshToken } = require('../../utils/getTokens');
const { res500 } = require('../../utils/errorResponse');

const handleLogin = async (req, res) => {
    try {
        const { email, pwd } = req.body;
        if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

        const foundUser = await User.findOne({ email: email }).exec();
        if (!foundUser) return res.status(401).json({ "message": "Invalid Email id or Password" });

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) return res.status(401).json({ "message": "Invalid Email id or Password" });

        const roles = Object.values(foundUser.roles).filter(Boolean);

        const accessToken = getAccessToken(foundUser.email, roles);

        const refreshToken = getRefreshToken(foundUser.email);
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        if (!result) return res500(res);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ roles, accessToken });
    }
    catch (err) {
        return res500(res);
    }

}

module.exports = { handleLogin };