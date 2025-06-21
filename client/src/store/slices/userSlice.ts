import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the state type
interface UserState {
  userId: string | null;
  name: string | null;
  isAuthenticated: boolean;
  settings: {
    audio: boolean;
    video: boolean;
    notifications: boolean;
  };
}

// Define the initial state
const initialState: UserState = {
  userId: null,
  name: null,
  isAuthenticated: false,
  settings: {
    audio: true,
    video: true,
    notifications: true,
  },
};

// Create the slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; name: string }>) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userId = null;
      state.name = null;
      state.isAuthenticated = false;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserState['settings']>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
  },
});

// Export actions
export const { setUser, clearUser, updateSettings } = userSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUserName = (state: RootState) => state.user.name;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserSettings = (state: RootState) => state.user.settings;

// Export reducer
export default userSlice.reducer;