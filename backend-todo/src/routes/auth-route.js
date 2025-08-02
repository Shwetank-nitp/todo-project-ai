const { Router } = require("express");
const { login, signup, getUser } = require("../controllers/auth-controller");
const verifyToken = require("../middlewares/decode-token");

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.get("/info", verifyToken, getUser);

module.exports = { authRouter };
