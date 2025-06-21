import { useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  loadDemoTasks,
  setTasksFromText,
  toggleTask,
} from '@/store/slices/selfGuidedTasksSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const SelfGuidedTasksTab = () => {
  const tasks = useAppSelector(state => state.selfGuidedTasks.tasks);
  const dispatch = useAppDispatch();
  const [tasksText, setTasksText] = useState('');

  const handleConvertToTasks = () => {
    dispatch(setTasksFromText(tasksText));
    setTasksText('');
  };

  const toggleTaskCompletion = (id: string) => {
    dispatch(toggleTask(id));
  };

  const handleLoadDemo = () => {
    dispatch(loadDemoTasks());
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        Use this section to define your own personal interview goals or reminders. These might
        include behavioral intentions (e.g., avoid interruptions, ask more questions), language
        considerations (e.g., review English terms), or self-improvement focus points. Enter one
        task per line and convert them into a checklist to stay on track.
      </p>

      <Textarea
        placeholder="E.g., Don’t interrupt, Check candidate’s English level, Ask for examples..."
        value={tasksText}
        onChange={e => setTasksText(e.target.value)}
        className="min-h-[100px] bg-gray-700 border-gray-600 text-white"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleConvertToTasks}
          disabled={!tasksText.trim()}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Convert to Checklist
        </Button>

        <Button
          onClick={handleLoadDemo}
          size="sm"
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Load Demo Tasks
        </Button>
      </div>

      {tasks.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium text-gray-200">Your Personal Checklist:</h4>
          {tasks.map(task => (
            <div key={task.id} className="flex items-start space-x-2">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="border-gray-500"
              />
              <label
                htmlFor={task.id}
                className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}
              >
                {task.text}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelfGuidedTasksTab;
