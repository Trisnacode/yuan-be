const bcrypt = require('bcrypt');

// import ENV Variables
const SALT = parseInt(process.env.SALT) || process.env.SALT;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = parseInt(process.env.JWT_EXP);

// import Response
const {RESPONSE_CODE, ERROR_CODE} = require('../response/constant');
const Response = require('../response/default');

// import other
const jwt = require('jsonwebtoken');

// import model
const User = require('../model/member');


async function login(req, res) {
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    let query = User.query().whereNotDeleted();
    switch (fields.method) {
      case 'PHONE':
        query = query.where('phone', fields.phone);
        break;

      default:
        query = query.where('email', fields.email);
        break;
    }

    const member = await query.first();
    if (!member) return resp.sendUnauthorized('Invalid User');

    // Bycrpt Compare Password
    const isPasswordMatch = await bcrypt.compare(fields.password, member.password);

    if (!isPasswordMatch) return resp.sendUnauthorized('Invalid Password');

    // Generate JWT
    const token = jwt.sign({
      id: member.id,
      method: 'LOGIN',
      type: 'USER',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXP,
    });

    // Define Payload
    const payload = {
      result: member,
      token: token,
    };

    resp.send(RESPONSE_CODE.SUCCESS_LOGIN, 'success', payload);
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function changePassword(req, res) {
  const id = req.user.id;
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    const user = await User.query().whereNotDeleted().findById(id);
    if (!user) return resp.sendUnauthorized('Invalid User');

    // Bycrpt Compare Password
    const isPasswordMatch = await bcrypt.compare(fields.password_old, member.password);
    if (!isPasswordMatch) return resp.sendUnauthorized('Invalid Password');

    // Change Password
    await User.query().where('id', id).patch({
      password: await bcrypt.hash(fields.password_new, SALT),
    });

    resp.send('SUCCESS CHANGE', 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function changeProfile(req, res) {
  const id = req.user.id;
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    const user = await User.query().whereNotDeleted().findById(id);
    if (!user) return resp.sendUnauthorized('Invalid Member');

    // Change Password
    await User.query().where('id', id).patch({
      name: fields.name,
    });

    resp.send('SUCCESS CHANGE', 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

module.exports = {
  login,
  changePassword,
  changeProfile,
};
