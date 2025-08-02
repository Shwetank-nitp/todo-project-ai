import React, { useState } from "react";
import { useTodos } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import ChatBot from "./ChatBot";

const Dashboard: React.FC = () => {
  const [showTodoForm, setShowTodoForm] = useState(false);
  const { todos } = useTodos();

  const completedTasks = todos.filter((todo) => todo.completed).length;
  const pendingTasks = todos.filter((todo) => !todo.completed).length;
  const overdueTasks = todos.filter(
    (todo) => !todo.completed && new Date(todo.dueDate) < new Date()
  ).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="glass-morphism rounded-2xl p-4 sm:p-6 border border-border/50 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {completedTasks}
                </p>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
              </div>
            </div>
          </div>

          <div className="glass-morphism rounded-2xl p-4 sm:p-6 border border-border/50 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingTasks}
                </p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </div>

          <div className="glass-morphism rounded-2xl p-4 sm:p-6 border border-border/50 hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {overdueTasks}
                </p>
                <p className="text-sm text-muted-foreground">Overdue Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-morphism rounded-2xl border border-border/50 bg-opacity-70">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-border/30 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Tasks
              </h2>
              <p className="text-muted-foreground mt-1">
                Manage your tasks efficiently
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="gradient"
                onClick={() => setShowTodoForm(true)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:inline">Add Task</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <TodoList />
          </div>
        </div>

        {/* Todo Form Modal */}
        <TodoForm
          isOpen={showTodoForm}
          onClose={() => setShowTodoForm(false)}
        />

        {/* Chat Bot */}
        <ChatBot />
      </div>
    </div>
  );
};

export default Dashboard;
