const {
  signupService,
  loginService,
  getUserService,
} = require("../services/authentication");

async function signup(req, res) {
  const { username, password, fullname } = req.body;

  if (!username) {
    return res.json({ error: "missing username" });
  }

  if (!password) {
    return res.json({ error: "missing password" });
  }

  if (!fullname) {
    return res.json({ error: "missing fullname" });
  }

  try {
    const user = await signupService(username, fullname, password);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: e.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username) {
    return res.json({ error: "missing username" });
  }

  if (!password) {
    return res.json({ error: "missing password" });
  }

  try {
    const user = await loginService(username, password);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: e.message });
  }
}

async function getUser(req, res) {
  const { username } = req.user;

  if (!username) {
    return res.json({ error: "missing username param" });
  }

  try {
    const user = await getUserService(username);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: e.message });
  }
}

module.exports = {
  signup,
  login,
  getUser,
};
