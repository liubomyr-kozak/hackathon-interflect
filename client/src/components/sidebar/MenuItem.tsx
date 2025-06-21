import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  isActive,
  isOpen,
  onClick,
}) => {
  return (
    <div 
      className={`group relative flex items-center text-sm gap-3.5 font-medium p-2 ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800"
      } rounded-md cursor-pointer ${!isOpen ? "justify-center" : ""}`}
      onClick={onClick}
    >
      <div className="min-w-[20px] flex justify-center">
        {React.createElement(icon, { size: 20 })}
      </div>
      <h2
        className={`whitespace-pre duration-500 ${
       !isOpen && "opacity-0 translate-x-28 overflow-hidden hidden"
        }`}
      >
        {label}
      </h2>
      {!isOpen && (
        <h2
          className="absolute left-16 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-50"
        >
          {label}
        </h2>
      )}
    </div>
  );
};

export default MenuItem;
