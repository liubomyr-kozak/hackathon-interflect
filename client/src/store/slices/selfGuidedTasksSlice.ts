import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelfGuidedTask {
  id: string;
  text: string;
  completed: boolean;
}

interface SelfGuidedTasksState {
  tasks: SelfGuidedTask[];
}

const initialState: SelfGuidedTasksState = {
  tasks: [],
};

export const selfGuidedTasksSlice = createSlice({
  name: 'selfGuidedTasks',
  initialState,
  reducers: {
    setTasksFromText: (state, action: PayloadAction<string>) => {
      const lines = action.payload
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

      state.tasks = lines.map((text, index) => ({
        id: `sgt-${index}-${Date.now()}`,
        text,
        completed: false,
      }));
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    loadDemoTasks: state => {
      state.tasks = [
        { id: 'demo-1', text: "Don't interrupt the candidate", completed: false },
        { id: 'demo-2', text: 'Clarify vague answers with follow-up questions', completed: false },
        { id: 'demo-3', text: 'Check use of English terminology', completed: false },
      ];
    },
    updateTasksFromLLM: (state, action: PayloadAction<SelfGuidedTask[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasksFromText, toggleTask, loadDemoTasks, updateTasksFromLLM } =
  selfGuidedTasksSlice.actions;

export default selfGuidedTasksSlice.reducer;
