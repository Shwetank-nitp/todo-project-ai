import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { host } from "@/cofig";

export interface Todo {
  id: string;
  title: string;
  description: string;
  urgency: "important" | "normal" | "not important";
  dueDate: string;
  completed: boolean;
  createdAt: string;
  username: string;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (
    todo: Omit<Todo, "id" | "createdAt" | "username" | "completed">
  ) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch(`${host}/v1/user/todo/my`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await res.json();
        if (!json.error) {
          setTodos(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    fetchTodos();
  }, [user]);

  const addTodo = async (
    todoData: Omit<Todo, "id" | "createdAt" | "username" | "completed">
  ) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${host}/v1/user/todo/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ...todoData }),
      });

      const json = await res.json();
      if (!json.error) {
        setTodos((prev) => [...prev, json.data]);
      }
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${host}/v1/user/todo/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const json = await res.json();
      if (!json.error) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? json.data : todo))
        );
      }
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${host}/v1/user/todo/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (!result.error) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  const toggleTodo = async (id: string) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${host}/v1/user/todo/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ id }),
      });

      const updated = await res.json();
      if (!updated.error) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updated.data : todo))
        );
      }
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  const value = {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
