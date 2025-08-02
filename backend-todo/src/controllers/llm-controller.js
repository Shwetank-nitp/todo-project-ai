const { processConversation } = require("../services/LLM-chatbot");

async function chatbotMessagesProcessing(req, res) {
  try {
    const { todoList, chats } = req.body;

    if (!Array.isArray(todoList) || !Array.isArray(chats)) {
      return res
        .status(400)
        .json({ error: "Invalid format: todoList and chats must be arrays" });
    }
    const chatbotResponse = await processConversation(todoList, chats);

    return res.json({ data: chatbotResponse });
  } catch (error) {
    return res.json({ error: "Internal server error" });
  }
}

module.exports = { chatbotMessagesProcessing };
