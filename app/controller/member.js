// // import Response
// const {RESPONSE_CODE, ERROR_CODE} = require('../response/constant');
// const Response = require('../response/default');

// import validation

async function index(req, res) {
  return res.status(501).send();
}

async function store(req, res) {
  return res.status(501).send();
}

async function update(req, res) {
  return res.status(501).send();
}

async function deleteItem(req, res) {
  return res.status(501).send();
}

async function updateProfile(req, res) {

}

module.exports = {
  index,
  store,
  update,
  deleteItem,
  updateProfile,
};
