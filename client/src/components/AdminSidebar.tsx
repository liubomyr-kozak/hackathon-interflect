import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardList, BookOpen, CheckSquare, HelpCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isAdmin: boolean;
}

export default function AdminSidebar({ isAdmin }: AdminSidebarProps) {
  const [agendaText, setAgendaText] = useState("");
  const [topicsText, setTopicsText] = useState("");
  const [tasksText, setTasksText] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

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

  // Handle tab click
  const handleTabClick = (value: string) => {
    if (activeTab === value && isExpanded) {
      // If clicking the active tab, collapse the sidebar
      setIsExpanded(false);
      setActiveTab(null);
    } else {
      // Otherwise, expand the sidebar and set the active tab
      setIsExpanded(true);
      setActiveTab(value);
    }
  };

  // If not admin, don't render anything
  if (!isAdmin) return null;

  return (
    <div className={cn(
      "bg-white border-l border-gray-200 flex h-full transition-all duration-300 z-10",
      isExpanded ? "w-80" : "w-16"
    )}>
      {/* Vertical Menu */}
      <div className="flex flex-col items-center py-4 border-r border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mb-6"
                onClick={() => {
                  setIsExpanded(false);
                  setActiveTab(null);
                }}
              >
                <ClipboardList className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Interview Tools</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === "agenda" ? "secondary" : "ghost"} 
                  size="icon"
                  onClick={() => handleTabClick("agenda")}
                  className="relative"
                >
                  <ClipboardList className="w-5 h-5" />
                  {activeTab === "agenda" && isExpanded && (
                    <ChevronRight className="w-4 h-4 absolute -right-2" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Interview Agenda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === "topics" ? "secondary" : "ghost"} 
                  size="icon"
                  onClick={() => handleTabClick("topics")}
                  className="relative"
                >
                  <BookOpen className="w-5 h-5" />
                  {activeTab === "topics" && isExpanded && (
                    <ChevronRight className="w-4 h-4 absolute -right-2" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Interview Topics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === "tasks" ? "secondary" : "ghost"} 
                  size="icon"
                  onClick={() => handleTabClick("tasks")}
                  className="relative"
                >
                  <CheckSquare className="w-5 h-5" />
                  {activeTab === "tasks" && isExpanded && (
                    <ChevronRight className="w-4 h-4 absolute -right-2" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Interview Tasks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === "questions" ? "secondary" : "ghost"} 
                  size="icon"
                  onClick={() => handleTabClick("questions")}
                  className="relative"
                >
                  <HelpCircle className="w-5 h-5" />
                  {activeTab === "questions" && isExpanded && (
                    <ChevronRight className="w-4 h-4 absolute -right-2" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Interview Questions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content Area - Only visible when expanded */}
      {isExpanded && activeTab && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === "agenda" && "Interview Agenda"}
              {activeTab === "topics" && "Interview Topics"}
              {activeTab === "tasks" && "Interview Tasks"}
              {activeTab === "questions" && "Interview Questions"}
            </h2>
          </div>

          <ScrollArea className="flex-1 p-4">
            {activeTab === "agenda" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Outline the structure and timeline for this interview.
                </p>
                <Textarea 
                  placeholder="Enter interview agenda here..."
                  value={agendaText}
                  onChange={(e) => setAgendaText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            )}

            {activeTab === "topics" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  List all topics and themes to cover during the interview.
                </p>
                <Textarea 
                  placeholder="Enter interview topics here..."
                  value={topicsText}
                  onChange={(e) => setTopicsText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Add tasks to cover interview gaps. Enter tasks below and convert to a checklist.
                </p>
                <Textarea 
                  placeholder="Enter tasks (one per line)..."
                  value={tasksText}
                  onChange={(e) => setTasksText(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleConvertToTasks}
                  disabled={!tasksText.trim()}
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
              </div>
            )}

            {activeTab === "questions" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Prepare questions and suggestions for the interview.
                </p>
                <Textarea 
                  placeholder="Enter interview questions here..."
                  value={questionsText}
                  onChange={(e) => setQuestionsText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
