import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface QuestionsTabProps {
  questionsText: string;
  setQuestionsText: (value: string) => void;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questionsText, setQuestionsText }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        Prepare questions and suggestions for the interview.
      </p>
      <Textarea 
        placeholder="Enter interview questions here..."
        value={questionsText}
        onChange={(e) => setQuestionsText(e.target.value)}
        className="min-h-[200px] bg-gray-700 border-gray-600 text-white"
      />
    </div>
  );
};

export default QuestionsTab;