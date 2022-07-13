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
const Member = require('../model/member');

async function register(req, res) {
  const fields = req.body;
  const resp = Response.make(res);

  try {
    let previousMember;
    // Check if phone number already exist
    previousMember = await Member.query().findOne({'phone': fields.phone});
    if (previousMember) return resp.sendClientError(ERROR_CODE.DUPLICATE_DATA, 'Phone already exist');

    // Check if email already exist
    previousMember = await Member.query().findOne({'email': fields.email});
    if (previousMember) return resp.sendClientError(ERROR_CODE.DUPLICATE_DATA, 'Email already exist');

    // Encrypt Password
    const encryptedPassword = await bcrypt.hash(fields.password, SALT);
    const data = await Member.query().insert({
      title: fields.title,
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      password: encryptedPassword,
      gender: fields.gender,
      address: fields.address,
      country: fields.country,
      city: fields.city,
      birth_date: fields.birth_date,
    });

    delete data.password;

    resp.send(RESPONSE_CODE.SUCCESS_LOGIN, 'success', data);
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function login(req, res) {
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    let query = Member.query().whereNotDeleted();
    switch (fields.method) {
      case 'PHONE':
        query = query.where('phone', fields.phone);
        break;

      default:
        query = query.where('email', fields.email);
        break;
    }

    const member = await query.first();
    if (!member) return resp.sendUnauthorized('Invalid Member');

    // Bycrpt Compare Password
    const isPasswordMatch = await bcrypt.compare(fields.password, member.password);

    if (!isPasswordMatch) return resp.sendUnauthorized('Invalid Password');

    // Generate JWT
    const token = jwt.sign({
      id: member.id,
      method: 'LOGIN',
      type: 'MEMBER',
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

async function resetPassword(req, res) {
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    let query = Member.query().whereNotDeleted();
    switch (fields.method) {
      case 'PHONE':
        query = query.where('phone', fields.phone);
        break;

      default:
        query = query.where('email', fields.email);
        break;
    }

    const member = await query.first();
    if (!member) return resp.sendUnauthorized('Invalid Member');

    // Generate JWT
    const token = jwt.sign({
      id: member.id,
      method: 'reset',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXP,
    });

    // TODO : Sent Email / Reset Link
    console.log(token);


    resp.send(RESPONSE_CODE.SUCCESS_LOGIN, 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function changePassword(req, res) {
  const id = req.member.id;
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    const member = await Member.query().whereNotDeleted().findById(id);
    if (!member) return resp.sendUnauthorized('Invalid Member');

    // Bycrpt Compare Password
    const isPasswordMatch = await bcrypt.compare(fields.password_old, member.password);
    if (!isPasswordMatch) return resp.sendUnauthorized('Invalid Password');

    // Change Password
    await Member.query().where('id', id).patch({
      password: await bcrypt.hash(fields.password_new, SALT),
    });

    resp.send('SUCCESS CHANGE', 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function changeProfile(req, res) {
  const id = req.member.id;
  const fields = req.body;
  const resp = Response.make(res);

  try {
    // Find user
    const member = await Member.query().whereNotDeleted().findById(id);
    if (!member) return resp.sendUnauthorized('Invalid Member');

    // Change Password
    await Member.query().where('id', id).patch({
      title: fields.title,
      name: fields.name,
      gender: fields.gender,
      address: fields.address,
      country: fields.country,
      city: fields.city,
      birth_date: fields.birth_date,
    });

    resp.send('SUCCESS CHANGE', 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

module.exports = {
  register,
  login,
  resetPassword,
  changePassword,
  changeProfile,
};
