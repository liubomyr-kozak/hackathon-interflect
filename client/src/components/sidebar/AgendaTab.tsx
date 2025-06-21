import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface AgendaTabProps {
  agendaText: string;
  setAgendaText: (value: string) => void;
}

const AgendaTab: React.FC<AgendaTabProps> = ({ agendaText, setAgendaText }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        Outline the structure and timeline for this interview.
      </p>
      <Textarea 
        placeholder="Enter interview agenda here..."
        value={agendaText}
        onChange={(e) => setAgendaText(e.target.value)}
        className="min-h-[200px] bg-gray-700 border-gray-600 text-white"
      />
    </div>
  );
};

export default AgendaTab;