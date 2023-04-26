const bcrypt = require('bcrypt');

const { User } = require('../../models');

const { DEFAULT_AVATAR_IMG_URL } = require('../../config/defaults');

const { HttpError } = require('../../routes/errors/HttpErrors');

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  const avatar = req.file?.path || DEFAULT_AVATAR_IMG_URL;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, `User with email ${email} is already registered`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const dbAnswer = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarURL: avatar,
  });

  res.status(201).json({
    id: dbAnswer._id,
    name,
    email,
  });
};

module.exports = addUser;
