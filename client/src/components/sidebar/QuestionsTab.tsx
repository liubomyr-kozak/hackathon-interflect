import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  setQuestionsFromText,
  addQuestion,
  loadDemoQuestions,
} from '@/store/slices/interviewQuestions/interviewQuestionsSlice.ts';
import { processQuestionsWithLLM } from '@/store/slices/interviewQuestions/interviewQuestionsSlice.action';

const QuestionsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(state => state.interviewQuestions.questions);
  const [questionsText, setQuestionsText] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const handleConvert = () => {
    dispatch(setQuestionsFromText(questionsText));
    setQuestionsText('');
  };

  const handleAdd = () => {
    if (newQuestion.trim()) {
      dispatch(addQuestion(newQuestion.trim()));
      setNewQuestion('');
    }
  };

  const handleLLM = () => {
    dispatch(processQuestionsWithLLM());
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-300">
          Prepare questions and suggestions for the interview.
        </p>
        <Button
          onClick={handleLLM}
          variant="ghost"
          size="icon"
          className="text-blue-400 hover:text-blue-500"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        placeholder="Enter multiple questions (one per line)..."
        value={questionsText}
        onChange={e => setQuestionsText(e.target.value)}
        className="min-h-[200px] bg-gray-700 border-gray-600 text-white"
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={handleConvert}
          disabled={!questionsText.trim()}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Convert to List
        </Button>
        <Button
          onClick={() => dispatch(loadDemoQuestions())}
          size="sm"
          variant="outline"
          className="text-white border-gray-500 hover:border-white"
        >
          Load Demo Questions
        </Button>
      </div>

      {questions.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium text-gray-200">Prepared Questions:</h4>
          <ul className="list-disc list-inside text-gray-300 text-sm">
            {questions.map((q, i) => (
              <li key={q.id}>{q.text}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-6 border-t border-gray-600">
        <Input
          placeholder="Type a new question..."
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
    </div>
  );
};

export default QuestionsTab;
