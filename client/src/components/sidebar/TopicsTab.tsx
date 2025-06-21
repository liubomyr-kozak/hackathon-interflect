import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TopicsTabProps {
  topicsText: string;
  setTopicsText: (value: string) => void;
}

const TopicsTab: React.FC<TopicsTabProps> = ({ topicsText, setTopicsText }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        List all topics and themes to cover during the interview.
      </p>
      <Textarea 
        placeholder="Enter interview topics here..."
        value={topicsText}
        onChange={(e) => setTopicsText(e.target.value)}
        className="min-h-[200px] bg-gray-700 border-gray-600 text-white"
      />
    </div>
  );
};

export default TopicsTab;