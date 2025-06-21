import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import AgendaTab from './AgendaTab/AgendaTab.tsx';
import TopicsTab from './TopicsTab';
import SelfGuidedTasksTab from './SelfGuidedTasksTab.tsx';
import QuestionsTab from './QuestionsTab';

interface TabContentProps {
  activeTab: string | null;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  if (!activeTab) return null;

  return (
    <div
      className={cn(
        'm-3 text-xl text-gray-100 font-semibold bg-[#1e1e1e] p-4 rounded-lg flex-1 max-w-4xl transition-all duration-500',
        'md:static absolute right-0 left-0 top-16 max-w-[350px]',
      )}
    >
      <div className="mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-lg font-semibold text-gray-200">
          {activeTab === 'agenda' && 'Interview Agenda'}
          {activeTab === 'topics' && 'Interview Topics'}
          {activeTab === 'tasks' && 'Interview Tasks'}
          {activeTab === 'questions' && 'Interview Questions'}
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {activeTab === 'agenda' && <AgendaTab />}

        {activeTab === 'topics' && <TopicsTab />}

        {activeTab === 'questions' && <QuestionsTab />}

        {activeTab === 'tasks' && <SelfGuidedTasksTab />}
      </ScrollArea>
    </div>
  );
};

export default TabContent;
