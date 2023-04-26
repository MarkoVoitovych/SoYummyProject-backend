const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { HttpError } = require('../routes/errors/HttpErrors');

const { JWT_ACCESS_SECRET } = process.env;

const authLogout = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, accessToken] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
  }
  try {
    const { id } = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    const user = await User.findById(id);
    if (!user || !user.accessToken || user.accessToken !== accessToken) {
      next(HttpError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      req.accessToken = accessToken;
      next();
    } else next(HttpError(401, error.message));
  }
};

module.exports = authLogout;
