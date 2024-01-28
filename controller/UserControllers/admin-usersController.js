const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { isPasswordValid } = require('../../utils/checkInputValidity');

const getAllUsers = async (req, res) => {
    try {
        const fields = ['-_id', '-__v', '-refreshToken', '-password'];
        const users = await User.find().select(fields.join(' '));
        if (!users) return res.status(204).json({ 'message': 'No users found' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getUser = async (req, res) => {
    try {
        const userid = req?.body?.id;
        if (!Number.isInteger(userid)) return res.status(400).json({ "message": 'User ID required' });
        const fields = ['-_id', '-__v', '-refreshToken', '-password'];
        const user = await User.findOne({ userid: req.params.id }).select(fields.join(' '));
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
        }
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateUserAuthDetails = async (req, res) => {
    try {
        const userid = req?.body?.id;
        if (!userid) return res.status(400).json({ "message": 'User ID required' });
        const field = req?.body?.field;
        const value = req?.body?.value;
        if (!field || !value)
            return res.status(400).json({ message: "Invalid input data" });

        if (field === 'email') {
            const user = await User.findOneAndUpdate(
                { userid },
                { email: value },
                { new: true }
            );
            return res.status(201).json({ message: "Email id updated successfully" });
        }
        else if (field === 'password') {
            if (!isPasswordValid(value))
                return res.status(400).json({ message: "Invalid password entered" });

            const hashedPwd = await bcrypt.hash(value, 10);
            const user = await User.findOneAndUpdate(
                { userid },
                { password: hashedPwd },
                { new: true }
            );
            return res.status(201).json({ message: "Password updated successfully" });
        }
        else
            return res.status(400).json({ message: "Invalid input data" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateUserRoles = async (req, res) => {
    try {
        const userid = req?.body?.id;
        if (!userid) return res.status(400).json({ "message": 'User ID required' });
        const field = req?.body?.field;
        const value = req?.body?.value;
        if (!field || !value)
            return res.status(400).json({ message: "Invalid input data" });
        // TODO - To be modified
        if (field === 'roles') {
            const user = await User.findOneAndUpdate(
                { userid },
                { roles: value },
                { new: true }
            );
            return res.status(201).json({ message: "Roles updated successfully" });
        }
        else
            return res.status(400).json({ message: "Invalid input data" });
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
        const user = await User.findOne({ userid: req.body.id }).exec();
        if (!user) {
            return res.status(204).json({ 'message': "No user found" });
        }
        const result = await user.deleteOne({ userid: req.body.id });
        res.status(203).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    updateUserAuthDetails,
    updateUserRoles,
    deleteUser,
}