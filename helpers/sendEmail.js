const nodemailer = require('nodemailer');

const { MAILING_HOST, MAILING_PASS } = process.env;

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: MAILING_HOST,
    pass: MAILING_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async data => {
  const email = { ...data, from: MAILING_HOST };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;
