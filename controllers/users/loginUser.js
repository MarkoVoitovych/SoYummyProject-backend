const bcrypt = require('bcrypt');
const { setToken } = require('../../helpers');
const { accessTokenExpiresIn } = require('../../config/defaults');

const { User } = require('../../models/');

const { HttpError } = require('../../routes/errors/HttpErrors');

const { SECRET_KEY } = process.env;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is invalid');
  }

  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw HttpError(401, 'Email or password is invalid');
  }

  const payload = {
    id: user._id,
  };

  const accessToken = setToken(payload, SECRET_KEY, accessTokenExpiresIn);
  await User.findByIdAndUpdate(user._id, {
    accessToken,
  });

  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      achievements: user.achievements,
    },
  });
};

module.exports = loginUser;
