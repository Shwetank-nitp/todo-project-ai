const { Router } = require("express");
const verifyToken = require("../middlewares/decode-token");
const { chatbotMessagesProcessing } = require("../controllers/llm-controller");

const chatBotRouter = Router();

chatBotRouter.post("/chat", verifyToken, chatbotMessagesProcessing);

module.exports = { chatBotRouter };
