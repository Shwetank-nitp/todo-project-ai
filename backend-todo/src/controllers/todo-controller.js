const {
  createTodoService,
  updateTodoService,
  deleteTodoService,
  toggleCompletion,
  getUserTodos,
} = require("../services/user-todo");

async function createTodo(req, res) {
  const { username } = req.user;
  const { title, description, urgency, dueDate } = req.body;

  if (!title || !urgency || !dueDate) {
    return res.json({ error: "Missing required fields" });
  }

  try {
    const todo = await createTodoService(
      username,
      title,
      dueDate,
      urgency,
      description
    );
    res.json({ data: todo });
  } catch (e) {
    res.json({ error: e.message });
  }
}

async function updateTodo(req, res) {
  const { username } = req.user;
  const { title, description, urgency, dueDate, id } = req.body;

  if (!id || !title || !urgency || !dueDate) {
    return res.json({ error: "Missing required fields" });
  }

  try {
    const todo = await updateTodoService(
      username,
      id,
      title,
      dueDate,
      urgency,
      description
    );
    res.json({ data: todo });
  } catch (e) {
    res.json({ error: e.message });
  }
}

async function deleteTodo(req, res) {
  const { username } = req.user;
  const { id } = req.body;

  if (!id) {
    return res.json({ error: "Missing id" });
  }

  try {
    await deleteTodoService(username, id);
    res.json({ success: true });
  } catch (e) {
    res.json({ error: e.message });
  }
}

async function toggleTodoCompletion(req, res) {
  const { username } = req.user;
  const { id } = req.body;

  if (!id) {
    return res.json({ error: "Missing id" });
  }

  try {
    const updated = await toggleCompletion(username, id);
    res.json({ data: updated });
  } catch (e) {
    res.json({ error: e.message });
  }
}

async function getTodos(req, res) {
  const { username } = req.user;

  if (!username) {
    return res.json({ error: "Username missing from token" });
  }

  try {
    const todos = await getUserTodos(username);
    res.json({ data: todos });
  } catch (e) {
    res.json({ error: e.message });
  }
}

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
  getTodos,
};
