const { User } = require('../../models');
const { JWT_ACCESS_SECRET, FRONTEND_BASE_URL } = process.env;
const { setToken, sendEmail } = require('../../helpers');

const userSubscriptionEmailTemplate = require('../../templates/userSubscriptionEmail');

const { HttpError } = require('../../routes/errors/HttpErrors');

const { emailTokenExpiresIn } = require('../../config/defaults');

const sendSubscriptionEmail = async (req, res) => {
  const { email } = req.body;
  const { _id } = req.user;

  const user = await User.findOne(_id);
  if (user.email === email) {
    if (user.subscribed) {
      throw HttpError(409, `User is already subscribed`);
    }
  } else {
    const emailAlreadyExist = await User.findOne({ email });
    if (emailAlreadyExist) {
      throw HttpError(409, `The email belongs to another user`);
    }
  }
  const payload = {
    _id,
    email,
  };
  const token = setToken(payload, JWT_ACCESS_SECRET, emailTokenExpiresIn);
  let result = await User.findByIdAndUpdate(_id, { subscriptionToken: token });
  if (!result) {
    throw HttpError(500, `Unable to save e-mail token to DB`);
  }

  const confirmationLink = `${FRONTEND_BASE_URL}/confirm-email?token=${token}`;
  result = await sendEmail({
    to: email,
    subject: 'Please, confirm your e-mail address',
    html: userSubscriptionEmailTemplate(confirmationLink),
  });

  res.json({
    'confirmation req sent with status code': result,
  });
};

module.exports = sendSubscriptionEmail;
