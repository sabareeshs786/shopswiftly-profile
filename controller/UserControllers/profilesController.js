const Profile = require('../../models/Profile');
const { isValidPhoneNumber, isValidName, getIntVal } = require('../../utils/utilFunctions');

// Can be accessible by user only
const getPersonalInfo = async (req, res) => {
    try {
        const userid = req.userid;
        if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
        const excludedFields = ['-_id', '-__v', '-addresses', '-defaultAddress'];
        const personalInfo = await Profile.findOne({ userid }).select(excludedFields.join(' '));
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
    const userid = req.userid;
    if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
    const fields = ['-_id', 'addresses', 'defaultAddress'];
    try {
        const addressesInfo = await Profile.find({ userid }).select(fields.join(' '));
        if (!addressesInfo)
            return res.status(404).json({ message: 'Profile not found' });
        console.log(addressesInfo);
        res.status(200).json(addressesInfo);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

const updatePersonalInfo = async (req, res) => {
    try {
        const userid = req.userid;
        if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
        const field = req?.body?.field;
        const value = req?.body?.value;
        const code = value.code || '+91';
        const num = value.num;
        let g;

        if (!field || !value)
            return res.status(400).json({ message: "Invalid input data" });
        if (field === 'phno') {
            if (!num || !isValidPhoneNumber(num))
                return res.status(400).json({ message: "Invalid input data" });

            const profile = await Profile.updateOne(
                { userid },
                {
                    $set: {
                        phno: {
                            code: code,
                            number: num,
                        }
                    }
                },
            ).exec();
            if (profile.modifiedCount === 1)
                return res.status(204).json({ message: "Phone number updated successfully" });
            else
                return res.status(200).join({ message: "Same phone number entered" });
        }
        else if (field === 'name') {
            if (!value || !isValidName(value))
                return res.status(400).json({ message: "Invalid input data" });

            const profile = await Profile.updateOne(
                { userid },
                {
                    $set: {
                        name: value
                    }
                },
            );
            if (profile.modifiedCount === 1)
                return res.status(204).json({ message: "Name updated successfully" });
            else
                return res.status(200).join({ message: "Same name entered" });
        }
        else if (field === 'gender') {
            if (value === "male")
                g = "m"
            else if (value === "female")
                g = "f"
            else
                return res.status(400).json({ message: "Invalid input data" });

            const profile = await Profile.updateOne(
                { userid },
                { 
                    $set:{
                        gender: g
                    }
                },
            ).exec();
            if(profile.modifiedCount === 1)
                return res.status(204).json({ message: "Gender updated successfully" });
            else
                return res.status(200).json({ message: "Same gender entered" });
        }
        else
            return res.status(400).json({ message: "Invalid input data" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addAddress = async (req, res) => {
    const userid = req.userid;
    if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
    const address = req?.body?.address;
    try {
        const profile = await Profile.updateOne(
            { userid },
            { $push: { addresses: address } },
            { new: true }
        ).exec();
        if (!profile)
            return res.status(201).json({ message: "Address added successfully" });
        else
            return res.status(401).json({ message: "Cannot add address" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateAddress = async (req, res) => {
    try {
        const userid = req.userid;
        if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
        const address = req?.body?.address;
        const index = req?.body?.index;
        if (!address || index === undefined || index === null)
            return res.status(400).json({ message: "Invalid input data" });

        const profile = await Profile.updateOne(
            { userid },
            { $set: { [`addresses.${index}`]: address } },
        ).exec();
        if (profile.modifiedCount === 1)
            return res.status(201).json({ message: "Address updated successfully" });
        else
            return res.status(201).json({ message: "Same address entered" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateDefaultAddress = async (req, res) => {
    try {
        const userid = req.userid;
        if (!userid) return res.status(400).json({ "message": 'Invalid input data' });
        const index = req?.body?.index;
        if (index === undefined || index === null)
            return res.status(400).json({ message: "Invalid input data" });
        const profile = await Profile.updateOne(
            { userid },
            { $set: { [`addresses.${index}`]: address } },
        ).exec();
    } catch (error) {
        res.status(500);
    }
}

module.exports = {
    getPersonalInfo,
    getAddresses,
    updatePersonalInfo,
    addAddress,
    updateAddress,
    updateDefaultAddress
}