const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async email => {
  try {
    const answer = await sgMail.send(email);
    return answer[0].statusCode;
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;
