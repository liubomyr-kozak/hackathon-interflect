import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { processQuestionsWithLLM } from './interviewQuestionsSlice.action.ts';

interface Question {
  id: string;
  text: string;
}

interface State {
  questions: Question[];
}

const initialState: State = {
  questions: [],
};

const interviewQuestionsSlice = createSlice({
  name: 'interviewQuestions',
  initialState,
  reducers: {
    setQuestionsFromText: (state, action: PayloadAction<string>) => {
      const lines = action.payload
        .split('\n')
        .map(q => q.trim())
        .filter(Boolean);

      state.questions = lines.map((text, index) => ({
        id: `q-${index}-${Date.now()}`,
        text,
      }));
    },
    addQuestion: (state, action: PayloadAction<string>) => {
      state.questions.push({
        id: `q-${state.questions.length}-${Date.now()}`,
        text: action.payload,
      });
    },
    loadDemoQuestions: state => {
      state.questions = [
        {
          id: 'demo-q1',
          text: 'Can you describe a recent technical challenge and how you solved it?',
        },
        { id: 'demo-q2', text: 'What’s your experience with writing unit tests in your projects?' },
        { id: 'demo-q3', text: 'How do you stay updated with the latest tech trends?' },
      ];
    },
  },
  extraReducers: builder => {
    builder.addCase(processQuestionsWithLLM.fulfilled, (state, action) => {
      state.questions = action.payload;
    });
  },
});

export const { setQuestionsFromText, addQuestion, loadDemoQuestions } =
  interviewQuestionsSlice.actions;

export default interviewQuestionsSlice.reducer;
