import React from "react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  isOpen: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isOpen }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4">
      <div className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md cursor-pointer ${!isOpen ? "justify-center" : ""}`}>
        <div className="min-w-[20px] flex justify-center">
          <LogOut size={20} />
        </div>
        <h2
          className={`whitespace-pre duration-500 ${
            !isOpen && "opacity-0 translate-x-28 overflow-hidden"
          }`}
        >
          Logout
        </h2>
        <h2
          className={`${
            isOpen && "hidden"
          } absolute left-16 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-50`}
        >
          Logout
        </h2>
      </div>
    </div>
  );
};

export default LogoutButton;
