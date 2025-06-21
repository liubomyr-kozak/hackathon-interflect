import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TasksTabProps {
  tasksText: string;
  setTasksText: (value: string) => void;
  tasks: Task[];
  handleConvertToTasks: () => void;
  toggleTaskCompletion: (id: string) => void;
}

const TasksTab: React.FC<TasksTabProps> = ({ 
  tasksText, 
  setTasksText, 
  tasks, 
  handleConvertToTasks, 
  toggleTaskCompletion 
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        Add tasks to cover interview gaps. Enter tasks below and convert to a checklist.
      </p>
      <Textarea 
        placeholder="Enter tasks (one per line)..."
        value={tasksText}
        onChange={(e) => setTasksText(e.target.value)}
        className="min-h-[100px] bg-gray-700 border-gray-600 text-white"
      />
      <Button 
        onClick={handleConvertToTasks}
        disabled={!tasksText.trim()}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Convert to Checklist
      </Button>

      {tasks.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium text-gray-200">Task Checklist:</h4>
          {tasks.map(task => (
            <div key={task.id} className="flex items-start space-x-2">
              <Checkbox 
                id={task.id} 
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="border-gray-500"
              />
              <label 
                htmlFor={task.id}
                className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}
              >
                {task.text}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksTab;