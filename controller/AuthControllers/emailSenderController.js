require('dotenv').config();

// Import nodemailer
const nodemailer = require('nodemailer');
const emailId = process.env.EMAIL_ID;
const password = process.env.PASSWORD;

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailId, // Your email address
    pass: password // Your email password
  }
});

const handleSendEmail = (to, subject, text) => {
  try {
    // Create an email message
    let mailOptions = {
      from: emailId,
      to: to,
      subject: subject,
      text: text
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Failed to send email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });

  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
  
};

module.exports = { handleSendEmail };