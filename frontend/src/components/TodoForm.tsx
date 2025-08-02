import React, { useState } from "react";
import { useTodos } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<
    "important" | "normal" | "not important"
  >("normal");
  const [dueDate, setDueDate] = useState<Date>();
  const { addTodo } = useTodos();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your task",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Error",
        description: "Please select a due date",
        variant: "destructive",
      });
      return;
    }

    addTodo({
      title: title.trim(),
      description: description.trim(),
      urgency,
      dueDate: dueDate.toISOString(),
    });

    toast({
      title: "Task Created",
      description: "Your task has been added successfully",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setUrgency("normal");
    setDueDate(undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="glass-morphism rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in bg-opacity-90">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Task
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="glass-morphism border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              className="glass-morphism border-border/50 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              value={urgency}
              onValueChange={(value: any) => setUrgency(value)}
            >
              <SelectTrigger className="glass-morphism border-border/50">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-border/50">
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="not important">Not Important</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal glass-morphism border-border/50",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 glass-morphism border-border/50"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
