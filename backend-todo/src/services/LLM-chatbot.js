const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatMistralAI } = require("@langchain/mistralai");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const apiKey = process.env.MISTRAL_AI_API || "";
const temp = 0.95;
const modelName = "mistral-large-latest";

const mistralLLM = new ChatMistralAI({
  apiKey,
  temperature: temp,
  model: modelName,
});

function prompt(chats) {
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an AI assistant that helps users manage their time effectively by analyzing their todo list. 
Your goal is to guide users on how to prioritize tasks based on urgency, due dates, and task descriptions.

The user’s todo list is provided as a JSON object under the variable: {todoListJsonString}.
Each task includes: title, description, urgency ("important", "normal", "not important"), due date (ISO format), and whether it is completed.

Respond to user queries by:
- Suggesting which tasks to focus on first
- Highlighting overdue or soon-due tasks
- Helping plan realistic schedules based on priorities
- Answering UI-related queries (e.g., how to use buttons like Add, Delete, Check, Update)
- Noting color meanings: red = important, green = normal, no color = not important, red alert = overdue

Be polite, supportive, and concise. Assume the user wants helpful advice about their tasks or UI.
`,
    ],
    ...chats.map((data) =>
      data.isHuman ? ["human", data.text] : ["ai", data.text]
    ),
  ]);

  return template;
}

async function processConversation(todoList, chats) {
  const chain = prompt(chats).pipe(mistralLLM);

  const res = await chain.invoke({
    todoListJsonString: JSON.stringify(todoList, null, 2),
  });

  return res.content;
}

module.exports = { processConversation };
