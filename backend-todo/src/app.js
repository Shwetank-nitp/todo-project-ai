const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { authRouter } = require("./routes/auth-route");
const { todoRouter } = require("./routes/todo-route");
const { chatBotRouter } = require("./routes/chatbot-route");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use("/v1/auth", authRouter);
app.use("/v1/user", todoRouter);
app.use("/v1/llm", chatBotRouter);

module.exports = app;
