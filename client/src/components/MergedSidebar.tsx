import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Menu, AlignLeft } from 'lucide-react';

// Import components
import SidebarMenu from './sidebar/SidebarMenu';
import LogoutButton from './sidebar/LogoutButton';
import TabContent from './sidebar/TabContent';

interface MergedSidebarProps {
  isAdmin: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function MergedSidebar({ isAdmin, isOpen = true, onToggle }: MergedSidebarProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const handleTabClick = (value: string) => {
    if (activeTab === value) {
      setActiveTab(null);
    } else {
      setActiveTab(value);
    }
  };

  if (!isAdmin) return null;

  return (
    <section className="flex relative">
      <span
        className="absolute text-white text-4xl top-5 left-4 cursor-pointer z-50 md:hidden"
        onClick={onToggle}
      >
        <AlignLeft size={20} className="p-2 bg-gray-900 rounded-md" />
      </span>

      <div
        className={cn(
          'bg-[#0e0e0e] min-h-screen duration-500 text-gray-100 z-40',
          open ? 'w-72 px-4' : 'w-16 px-2',
          'md:relative md:left-0',
          isOpen ? 'left-0' : '-left-[300px]',
          'fixed top-0 bottom-0',
        )}
      >
        <div className={cn('py-3 flex', open ? 'justify-end' : 'justify-center')}>
          <Menu size={20} className="cursor-pointer" onClick={() => setOpen(!open)} />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative overflow-y-auto h-[calc(100vh-150px)]">
          {/* Sidebar Menu */}
          <SidebarMenu activeTab={activeTab} open={open} handleTabClick={handleTabClick} />
        </div>

        {/* Logout button */}
        <LogoutButton isOpen={open} />
      </div>

      <TabContent activeTab={activeTab} />
    </section>
  );
}
