const jwt = require('jsonwebtoken');

// Export Response
const Response = require('../response/default');

// Export env Variable
const JWT_SECRET = process.env.JWT_SECRET;

const authMember = (req, res, next) => {
  const token = req.headers.authorization;
  const Resp = Response.make(res);

  if (!token) {
    return Resp.sendUnauthorized('A token is required for authentication');
  }
  try {
    const splitToken = token.split(' ')[1];
    const decoded = jwt.verify(splitToken, JWT_SECRET);
    if (decoded.method !== 'LOGIN') return Resp.sendUnauthorized('Invalid Token');
    req.member = decoded;
  } catch (err) {
    console.error(err);
    return Resp.sendUnauthorized('Invalid Token');
  }

  return next();
};

const authReset = (req, res, next) => {
  const token = req.headers.authorization;
  const Resp = Response.make(res);
  if (!token) {
    return Resp.sendUnauthorized('A token is required for authentication');
  }
  try {
    const splitToken = token.split(' ')[1];
    const decoded = jwt.verify(splitToken, JWT_SECRET);
    if (decoded.method !== 'RESET') return Resp.sendUnauthorized('Invalid Token');
    req.member = decoded;
  } catch (err) {
    console.error(err);
    return Resp.sendUnauthorized('Invalid Token');
  }
  return next();
};

module.exports = {
  authMember,
  authReset,
};
