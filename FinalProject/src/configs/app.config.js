require("dotenv").config();

module.exports = {
  PORT: process.env.PORT, //Localhost
  URLDB: process.env.URLDB, //Url MongoDB
  JWTSECRET: process.env.JWTSECRET,
  JWTlinksecret: process.env.JWTLINKSECRET, //secret JWT firm
  environment: process.env.NODE_ENV || "dev", 
  identifier: process.env.EMAIL_IDENTIFIER,
  password: process.env.EMAIL_PASSWORD,
  sms: {
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAccountToken: process.env.TWILIO_ACCOUNT_TOKEN,
      twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
    },
};
