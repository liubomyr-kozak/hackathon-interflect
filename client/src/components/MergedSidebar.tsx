import { useState } from "react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Menu, AlignLeft } from "lucide-react";

// Import components
import SidebarMenu from "./sidebar/SidebarMenu";
import LogoutButton from "./sidebar/LogoutButton";
import TabContent from "./sidebar/TabContent";

interface MergedSidebarProps {
  isAdmin: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function MergedSidebar({ isAdmin, isOpen = true, onToggle }: MergedSidebarProps) {
  const [agendaText, setAgendaText] = useState("");
  const [topicsText, setTopicsText] = useState("");
  const [tasksText, setTasksText] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

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
    if (activeTab === value) {
      // If clicking the active tab, clear it
      setActiveTab(null);
    } else {
      // Otherwise, set the active tab
      setActiveTab(value);
    }
  };

  // If not admin, don't render anything
  if (!isAdmin) return null;

  return (
    <section className="flex relative">
      {/* Mobile toggle button */}
      <span
        className="absolute text-white text-4xl top-5 left-4 cursor-pointer z-50 md:hidden"
        onClick={onToggle}
      >
        <AlignLeft size={20} className="p-2 bg-gray-900 rounded-md" />
      </span>

      <div
        className={cn(
          "bg-[#0e0e0e] min-h-screen duration-500 text-gray-100 z-40",
          open ? "w-72 px-4" : "w-16 px-2",
          "md:relative md:left-0",
          isOpen ? "left-0" : "-left-[300px]",
          "fixed top-0 bottom-0"
        )}
      >
        <div className={cn("py-3 flex", open ? "justify-end" : "justify-center")}>
          <Menu
            size={20}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative overflow-y-auto h-[calc(100vh-150px)]">
          {/* Sidebar Menu */}
          <SidebarMenu 
            activeTab={activeTab} 
            open={open} 
            handleTabClick={handleTabClick} 
          />
        </div>

        {/* Logout button */}
        <LogoutButton isOpen={open} />
      </div>

      {/* Tab Content */}
      <TabContent 
        activeTab={activeTab}
        open={open}
        agendaText={agendaText}
        setAgendaText={setAgendaText}
        topicsText={topicsText}
        setTopicsText={setTopicsText}
        tasksText={tasksText}
        setTasksText={setTasksText}
        tasks={tasks}
        handleConvertToTasks={handleConvertToTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        questionsText={questionsText}
        setQuestionsText={setQuestionsText}
      />
    </section>
  );
}
