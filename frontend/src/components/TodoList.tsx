import React, { useState, useMemo } from "react";
import { useTodos, Todo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import TodoEditForm from "./TodoEditForm";

const TodoList: React.FC = () => {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const sortedTodos = useMemo(() => {
    const priorityOrder = { important: 3, normal: 2, "not important": 1 };

    return [...todos].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by priority
      const priorityDiff = priorityOrder[b.urgency] - priorityOrder[a.urgency];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [todos]);

  const isExpired = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "important":
        return "priority-high";
      case "normal":
        return "priority-normal";
      case "not important":
        return "priority-low";
      default:
        return "priority-normal";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      important: "destructive",
      normal: "default",
      "not important": "secondary",
    };
    return variants[urgency] || "default";
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Clock className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No tasks yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTodos.map((todo) => {
        const expired = isExpired(todo.dueDate, todo.completed);

        return (
          <div
            key={todo.id}
            className={cn(
              "glass-morphism rounded-xl p-4 border border-border/50 hover-lift animate-fade-in",
              getUrgencyColor(todo.urgency),
              {
                "task-expired": expired,
                "task-completed": todo.completed,
                "opacity-75": todo.completed,
              }
            )}
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="mt-1 sm:mt-1"
              />

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <h3
                      className={cn(
                        "font-medium mb-1 break-words",
                        todo.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.title}
                    </h3>

                    {todo.description && (
                      <p
                        className={cn(
                          "text-sm text-muted-foreground mb-3 break-words",
                          todo.completed && "line-through"
                        )}
                      >
                        {todo.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                        {expired && (
                          <AlertTriangle className="w-3 h-3 text-destructive ml-1 flex-shrink-0" />
                        )}
                      </div>

                      <Badge
                        variant={getUrgencyBadge(todo.urgency)}
                        className="text-xs"
                      >
                        {todo.urgency}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTodo(todo)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {editingTodo && (
        <TodoEditForm
          todo={editingTodo}
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
};

export default TodoList;
