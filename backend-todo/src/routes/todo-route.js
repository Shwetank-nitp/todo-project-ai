const { Router } = require("express");
const verifyToken = require("../middlewares/decode-token");
const {
  getTodos,
  updateTodo,
  createTodo,
  deleteTodo,
  toggleTodoCompletion,
} = require("../controllers/todo-controller");

const todoRouter = Router();

todoRouter.get("/todo/my", verifyToken, getTodos);
todoRouter.post("/todo/create", verifyToken, createTodo);
todoRouter.put("/todo/update", verifyToken, updateTodo);
todoRouter.delete("/todo/delete", verifyToken, deleteTodo);
todoRouter.patch("/todo/toggle", verifyToken, toggleTodoCompletion);

module.exports = { todoRouter };
