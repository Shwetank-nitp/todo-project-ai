const bcrypt = require("bcrypt");

async function generatePassword(plaintext) {
  return await bcrypt.hash(plaintext, 10);
}

async function verifyPassword(plaintext, hashed) {
  return await bcrypt.compare(plaintext, hashed);
}

module.exports = {
  generatePassword,
  verifyPassword,
};
