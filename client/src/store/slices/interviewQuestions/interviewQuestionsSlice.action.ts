import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

export const processQuestionsWithLLM = createAsyncThunk(
  'interviewQuestions/processWithLLM',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const questions = state.interviewQuestions?.questions ?? [];

    try {
      const response = await fetch('/api/llm/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: questions.map(q => q.text),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process questions');
      }

      const data = await response.json();
      // Очікується, що API поверне масив об'єктів: [{ id, text }]
      return data.updatedQuestions;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
