import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardList, BookOpen, CheckSquare, HelpCircle } from "lucide-react";

interface AdminSidebarProps {
  isAdmin: boolean;
}

export default function AdminSidebar({ isAdmin }: AdminSidebarProps) {
  const [agendaText, setAgendaText] = useState("");
  const [topicsText, setTopicsText] = useState("");
  const [tasksText, setTasksText] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);

  // Convert text to tasks with checkboxes
  const handleConvertToTasks = () => {
    if (!tasksText.trim()) return;

    const newTasks = tasksText
      .split('\n')
      .filter(line => line.trim())
      .map(line => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: line.trim(),
        completed: false
      }));

    setTasks(prev => [...prev, ...newTasks]);
    setTasksText("");
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // If not admin, don't render anything
  if (!isAdmin) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Interview Tools</h2>
        <p className="text-sm text-gray-500">Manage your interview process</p>
      </div>

      <Tabs defaultValue="agenda" className="flex-1 flex flex-col">
        <TabsList className="flex flex-col p-1 mx-4 mt-2 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="agenda" className="flex items-center justify-start w-full">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  <span>Interview Agenda</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Interview Agenda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="topics" className="flex items-center justify-start w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Interview Topics</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Interview Topics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="tasks" className="flex items-center justify-start w-full">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  <span>Interview Tasks</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Interview Tasks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="questions" className="flex items-center justify-start w-full">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Interview Questions</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Interview Questions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="agenda" className="mt-2">
            <h3 className="text-md font-medium mb-2">Interview Agenda</h3>
            <p className="text-sm text-gray-500 mb-4">
              Outline the structure and timeline for this interview.
            </p>
            <Textarea 
              placeholder="Enter interview agenda here..."
              value={agendaText}
              onChange={(e) => setAgendaText(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>

          <TabsContent value="topics" className="mt-2">
            <h3 className="text-md font-medium mb-2">Interview Topics</h3>
            <p className="text-sm text-gray-500 mb-4">
              List all topics and themes to cover during the interview.
            </p>
            <Textarea 
              placeholder="Enter interview topics here..."
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>

          <TabsContent value="tasks" className="mt-2">
            <h3 className="text-md font-medium mb-2">Interview Tasks</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add tasks to cover interview gaps. Enter tasks below and convert to a checklist.
            </p>
            <Textarea 
              placeholder="Enter tasks (one per line)..."
              value={tasksText}
              onChange={(e) => setTasksText(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <Button 
              onClick={handleConvertToTasks}
              disabled={!tasksText.trim()}
              className="mb-4"
              size="sm"
            >
              Convert to Checklist
            </Button>

            {tasks.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Task Checklist:</h4>
                {tasks.map(task => (
                  <div key={task.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={task.id} 
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <label 
                      htmlFor={task.id}
                      className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                    >
                      {task.text}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="mt-2">
            <h3 className="text-md font-medium mb-2">Interview Questions</h3>
            <p className="text-sm text-gray-500 mb-4">
              Prepare questions and suggestions for the interview.
            </p>
            <Textarea 
              placeholder="Enter interview questions here..."
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
