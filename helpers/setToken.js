const jwt = require('jsonwebtoken');

const setToken = (payload, JWT_ACCESS_SECRET, expiresIn) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn,
  });
};

module.exports = setToken;
