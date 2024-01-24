const bcrypt = require('bcrypt');
const User = require('../../models/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

const updateUserAuthDetails = async (req, res) => {
    const userid = req?.body?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const field = req?.body?.field;
    const value = req?.body?.value;
    if(!field || !value)
        return res.status(400).json({message: "Invalid input data"});

    if (field === 'email') {
        const user = await User.findOneAndUpdate(
            { userid }, 
            { email: value }, 
            { new: true }
        );
        return res.status(201).json({message: "Email id updated successfully"});
    }
    else if(field === 'password'){
        const hashedPwd = await bcrypt.hash(value, 10);
        const user = await User.findOneAndUpdate(
            { userid }, 
            { password: hashedPwd }, 
            { new: true }
        );
        return res.status(201).json({message: "Password updated successfully"});
    }
    else
        return res.status(400).json({message: "Invalid input data"});
}

const updateUserRoles = async (req, res) => {
    const userid = req?.body?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const field = req?.body?.field;
    const value = req?.body?.value;
    if(!field || !value)
        return res.status(400).json({message: "Invalid input data"});
    // TODO - To be modified
    if(field === 'roles'){
        const user = await User.findOneAndUpdate(
            { userid }, 
            { roles: value },
            { new: true }
        );
        return res.status(201).json({message: "Roles updated successfully"});
    }
    else
        return res.status(400).json({message: "Invalid input data"});
}

const deleteUser = async (req, res) => {
    if (!req?.body?.userid) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = {
    getAllUsers,
    getUser,
    updateUserAuthDetails,
    deleteUser,
}