const bcrypt = require('bcrypt');
const prisma = require('../../prisma');

// import ENV Variables
const SALT = parseInt(process.env.SALT) || process.env.SALT;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = parseInt(process.env.JWT_EXP);

// import Response
const {RESPONSE_CODE, ERROR_CODE} = require('../response/constant');
const Response = require('../response/default');

// import validateion
const {validateRegister, validateLogin} = require('../validation/auth');

// import other
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const fields = req.body;
  const resp = Response.make(res);

  // validate
  const validation = await validateRegister(fields);
  if (validation !== true) return resp.sendInvalidData(validation);

  try {
    // Check if phone number already exist
    const previousMember = await prisma.member.findFirst({
      where: {
        phone: fields.phone,
      },
    });

    if (previousMember) return resp.sendClientError(ERROR_CODE.DUPLICATE_DATA, 'Phone already exist');

    // Encrypt Password
    const encryptedPassword = await bcrypt.hash(fields.password, SALT);
    const data = await prisma.member.create({
      data: {
        title: fields.title,
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        password: encryptedPassword,
        gender: fields.gender,
        address: fields.address,
        country: fields.country,
        city: fields.city,
        birth_date: fields.birthDate,
      },
    });

    // if (data) {
    resp.send(data, RESPONSE_CODE.SUCCESS_LOGIN, 'success');
    // }
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function login(req, res) {
  const fields = req.body;
  const resp = Response.make(res);

  // validate
  const validation = await validateLogin(fields);
  if (validation !== true) return resp.sendInvalidData(validation);

  try {
    // Get Data based on phone
    const member = await prisma.member.findFirst({
      where: {
        AND: [
          {phone: fields.phone},
          {deleted_at: null},
        ],
      },
    });

    if (!member) return resp.sendUnauthorized('Invalid Member');

    // Bycrpt Compare Password
    const isPasswordMatch = await bcrypt.compare(fields.password, member.password);

    if (!isPasswordMatch) return resp.sendUnauthorized('Invalid Password');

    // Generate JWT
    const token = jwt.sign({
      id: member.id,
      phone: member.phone,
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

    resp.send(payload, RESPONSE_CODE.SUCCESS_LOGIN, 'success');
  } catch (error) {
    console.error(error);
    resp.sendServerError(ERROR_CODE.ERROR_SERVER);
  }
}

async function resetPassword(req, res) {

}

async function changePassword(req, res) {

}

module.exports = {
  register,
  login,
  resetPassword,
  changePassword,
};
