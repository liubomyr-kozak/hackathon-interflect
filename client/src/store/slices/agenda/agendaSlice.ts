import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { parseMarkdownAgenda } from './helper';

export interface AgendaItem {
  id: string;
  text: string;
  checked: boolean;
  children?: AgendaItem[];
}

interface AgendaState {
  items: AgendaItem[];
  isEditing: boolean;
}

const initialState: AgendaState = {
  items: [],
  isEditing: true,
};

export const agendaSlice = createSlice({
  name: 'agenda',
  initialState,
  reducers: {
    setItemsFromText: (state, action: PayloadAction<string>) => {
      state.items = parseMarkdownAgenda(action.payload);
      state.isEditing = false;
    },
    toggleItem: (state, action: PayloadAction<string>) => {
      const toggleById = (items: AgendaItem[]): boolean => {
        for (let item of items) {
          if (item.id === action.payload) {
            item.checked = !item.checked;
            return true;
          }
          if (item.children && toggleById(item.children)) return true;
        }
        return false;
      };
      toggleById(state.items);
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    bulkToggleChecked: (state, action: PayloadAction<{ id: string; checked: boolean }[]>) => {
      const toggleByIds = (items: AgendaItem[]) => {
        for (let item of items) {
          const match = action.payload.find(x => x.id === item.id);
          if (match) item.checked = match.checked;
          if (item.children) toggleByIds(item.children);
        }
      };
      toggleByIds(state.items);
    },
  },
});

export const { setItemsFromText, toggleItem, setIsEditing, bulkToggleChecked } =
  agendaSlice.actions;
export default agendaSlice.reducer;
