const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordVerificationCodesSchema = new Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600000 } // Expires in 10 minutes
});

const ForgotPasswordVerificationCodes = mongoose.model('ForgotPasswordVerificationCode', forgotPasswordVerificationCodesSchema);

module.exports = ForgotPasswordVerificationCodes;