require('dotenv').config();

// Import nodemailer
const nodemailer = require('nodemailer');
const emailId = process.env.ADMIN_EMAIL_ID;
const password = process.env.ADMIN_PASSWORD;

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailId, // Your email address
    pass: password // Your email password
  }
});

const handleSendEmail = (to, subject, text) => {

  // Create an email message
  let mailOptions = {
    from: emailId, // Sender address
    to: to, // Recipient address
    subject: subject, // Subject line
    text: text // Plain text body
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
};