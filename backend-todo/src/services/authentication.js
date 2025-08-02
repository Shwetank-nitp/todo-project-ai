const User = require("../models/user");
const {
  generatePassword,
  verifyPassword,
} = require("../utils/password-bcrypt");
const jwt = require("jsonwebtoken");

async function signupService(username, fullname, password) {
  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await generatePassword(password);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    fullname,
  });

  if (!newUser) {
    throw new Error("Failed to create user. Please try again.");
  }

  const authUser = await loginService(username, password);

  return authUser;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-dev-secret";

async function loginService(username, password) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("UserNotFound");
  }

  const valid = await verifyPassword(password, user.password);

  if (!valid) {
    throw new Error("InvalidPassword");
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return {
    id: user._id,
    username: user.username,
    fullname: user.fullname,
    token,
  };
}

async function getUserService(username) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("UserNotFound");
  }
  return {
    id: user._id,
    username: user.username,
    fullname: user.fullname,
  };
}

module.exports = {
  signupService,
  loginService,
  getUserService,
};
