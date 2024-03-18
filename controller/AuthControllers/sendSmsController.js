require('dotenv').config();
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const handleSendSms = async (req, res) => {
    try {
        const phno = req.body?.phno;
        console.log(phno);

        // Define parameters for the SMS message
        const params = {
            Message: `Your OTP code is: ${Math.random().toString().substring(2, 8)}. Please don't share`, // Generate a 6-digit OTP code
            PhoneNumber: phno,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'String'
                }
            }
        };

        // Create an SNS client with the specified configuration
        const sns = new SNSClient({
            region: process.env.AWS_REGION, // AWS region from environment variables
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY, // AWS access key from environment variables
                secretAccessKey: process.env.AWS_SECRET_KEY // AWS secret key from environment variables
            }
        });

        // Send the SMS message using the defined SNS client and parameters
        const command = new PublishCommand(params);
    
        // Send the SMS message using the SNS client and the created command
        const message = await sns.send(command);
        console.log("Message sent:", message);
        return res.status(200).json({message: "Message sent"});
    } catch (error) {
        console.log("Error sending message:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { handleSendSms };
