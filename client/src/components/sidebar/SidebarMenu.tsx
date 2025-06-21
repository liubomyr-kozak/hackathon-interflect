import React from "react";
import MenuItem from "./MenuItem";
import { ClipboardCheck, BookOpen, CheckSquare, HelpCircle } from "lucide-react";

interface SidebarMenuProps {
  activeTab: string | null;
  open: boolean;
  handleTabClick: (tab: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeTab,
  open,
  handleTabClick,
}) => {
  const menuItems = [
    {
      id: "agenda",
      icon: ClipboardCheck,
      label: "Interview Agenda",
    },
    {
      id: "topics",
      icon: BookOpen,
      label: "Interview Topics",
    },
    {
      id: "tasks",
      icon: CheckSquare,
      label: "Interview Tasks",
    },
    {
      id: "questions",
      icon: HelpCircle,
      label: "Interview Questions",
    },
  ];

  return (
    <div className={`flex flex-col gap-2 ${!open ? "items-center" : ""}`}>
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.id}
          isOpen={open}
          onClick={() => handleTabClick(item.id)}
        />
      ))}
    </div>
  );
};

export default SidebarMenu;
