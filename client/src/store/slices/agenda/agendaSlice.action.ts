import { createAsyncThunk } from '@reduxjs/toolkit';
import { AgendaItem } from './agendaSlice';

export const updateCheckedFromLLM = createAsyncThunk(
  'agenda/updateCheckedFromLLM',
  async (items: AgendaItem[], thunkAPI) => {
    // тут симуляція відповіді від LLM або fetch/post-запит
    return [
      { id: items[0].id, checked: true },
      { id: items[0].children?.[0]?.id || '', checked: true },
    ];
  },
);
