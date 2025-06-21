import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import AgendaTab from "./AgendaTab";
import TopicsTab from "./TopicsTab";
import TasksTab from "./TasksTab";
import QuestionsTab from "./QuestionsTab";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TabContentProps {
  activeTab: string | null;
  open: boolean;
  agendaText: string;
  setAgendaText: (value: string) => void;
  topicsText: string;
  setTopicsText: (value: string) => void;
  tasksText: string;
  setTasksText: (value: string) => void;
  tasks: Task[];
  handleConvertToTasks: () => void;
  toggleTaskCompletion: (id: string) => void;
  questionsText: string;
  setQuestionsText: (value: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  open,
  agendaText,
  setAgendaText,
  topicsText,
  setTopicsText,
  tasksText,
  setTasksText,
  tasks,
  handleConvertToTasks,
  toggleTaskCompletion,
  questionsText,
  setQuestionsText,
}) => {
  if (!activeTab) return null;

  return (
    <div className={cn(
      "m-3 text-xl text-gray-100 font-semibold bg-[#1e1e1e] p-4 rounded-lg flex-1 max-w-4xl transition-all duration-500",
      "md:static absolute right-0 left-0 top-16"
    )}>
      <div className="mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-lg font-semibold text-gray-200">
          {activeTab === "agenda" && "Interview Agenda"}
          {activeTab === "topics" && "Interview Topics"}
          {activeTab === "tasks" && "Interview Tasks"}
          {activeTab === "questions" && "Interview Questions"}
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {activeTab === "agenda" && (
          <AgendaTab 
            agendaText={agendaText} 
            setAgendaText={setAgendaText} 
          />
        )}

        {activeTab === "topics" && (
          <TopicsTab 
            topicsText={topicsText} 
            setTopicsText={setTopicsText} 
          />
        )}

        {activeTab === "tasks" && (
          <TasksTab 
            tasksText={tasksText}
            setTasksText={setTasksText}
            tasks={tasks}
            handleConvertToTasks={handleConvertToTasks}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        )}

        {activeTab === "questions" && (
          <QuestionsTab 
            questionsText={questionsText} 
            setQuestionsText={setQuestionsText} 
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default TabContent;