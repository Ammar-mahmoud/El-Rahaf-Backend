//const twilio = require('twilio');
require('dotenv').config();

//const accountSid = process.env.TWILIO_ACCOUNT_SID;
//const authToken = process.env.TWILIO_AUTH_TOKEN;
//const client = twilio(accountSid, authToken);

const sendOtp = async ({ phone, message }) => {
  try {
    // const msg = await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });
    console.log('OTP sent:', message);
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = sendOtp;
