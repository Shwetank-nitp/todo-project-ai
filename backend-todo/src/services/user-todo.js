const { Todo } = require("../models/todo");

async function createTodoService(
  username,
  title,
  existing,
  urgency,
  description
) {
  return await Todo.create({
    username,
    title: title.trim(),
    description: description?.trim() || "",
    urgency,
    dueDate: existing,
    completed: false,
  });
}

async function updateTodoService(
  username,
  todoId,
  title,
  existing,
  urgency,
  description
) {
  const updated = await Todo.findOneAndUpdate(
    { _id: todoId, username },
    {
      title: title.trim(),
      description: description?.trim() || "",
      urgency,
      dueDate: existing,
    },
    { new: true }
  );

  if (!updated) {
    throw new Error("Todo not found or access denied");
  }

  return updated;
}

async function deleteTodoService(username, todoId) {
  const deleted = await Todo.findOneAndDelete({
    _id: todoId,
    username,
  });

  if (!deleted) {
    throw new Error("Todo not found or access denied");
  }

  return deleted;
}

async function toggleCompletion(username, todoId) {
  const todo = await Todo.findOne({ _id: todoId, username });

  if (!todo) {
    throw new Error("Todo not found or access denied");
  }

  todo.completed = !todo.completed;
  await todo.save();
  return todo;
}

async function getUserTodos(username) {
  return await Todo.find({ username });
}

module.exports = {
  createTodoService,
  updateTodoService,
  deleteTodoService,
  toggleCompletion,
  getUserTodos,
};
