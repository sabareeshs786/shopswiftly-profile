const Profile = require('../../models/Profile');

const getPersonalInfo = async (req, res) => {
    const userid = req?.params?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const fields = ['-id', '-createdAt', '-updatedAt', '-__v', '-addresses'];
    try {
        const personalInfo = await Profile.find({ userid }).select(fields.join(' '));
        if (!personalInfo) {
            return res.status(404).json({ 'message': 'Profile not found' });
        }
        res.json(personalInfo);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const getAddresses = async (req, res) => {
    const userid = req?.params?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const fields = ['-id', 'addresses'];
    try {
        const addressesInfo = await Profile.find({ userid }).select(fields.join(' '));
        if (!addressesInfo)
            return res.status(404).json({ message: 'Profile not found' });
        res.status(204).json(addressesInfo);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const updatePersonalInfo = async (req, res) => {
    const userid = req?.body?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const field = req?.body?.field;
    const value = req?.body?.value;
    const code = value.code || '+91';
    const num = value.num;

    if (!field || !value)
        return res.status(400).json({ message: "Invalid input data" });
    try {
        if (field === 'phno') {
            const profile = await Profile.findOneAndUpdate(
                { userid },
                {
                    phno: {
                        code: code,
                        number: num,
                    }
                },
                { new: true }
            );
            return res.status(201).json({ message: "Phone number updated successfully" });
        }
        else if (field === 'name') {
            const profile = await Profile.findOneAndUpdate(
                { userid },
                { name: value },
                { new: true }
            );
            return res.status(201).json({ message: "Name updated successfully" });
        }
        else if (field === 'gender') {
            const profile = await Profile.findOneAndUpdate(
                { userid },
                { gender: value },
                { new: true }
            );
            return res.status(201).json({ message: "Gender updated successfully" });
        }
        else
            return res.status(400).json({ message: "Invalid input data" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addAddress = async (req, res) => {
    const userid = req?.body?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const address = req?.body?.address;
    try {
        const profile = await Profile.findOneAndUpdate(
            { userid },
            { $push: { addresses: address } },
            { new: true }
        );
        return res.status(201).json({ message: "Address added successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateAddress = async (req, res) => {
    const userid = req?.body?.userid;
    if (!userid) return res.status(400).json({ "message": 'User ID required' });
    const address = req?.body?.address;
    const index = req?.body?.index;
    try {
        const profile = Profile.updateOne(
            { userid },
            { $set: { [`addresses.${index}`]: address } }
        );
        return res.status(201).json({ message: "Address updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getPersonalInfo,
    getAddresses,
    updatePersonalInfo,
    addAddress,
    updateAddress
}