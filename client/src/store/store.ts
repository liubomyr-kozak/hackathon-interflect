import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './slices/userSlice';
import meetingReducer from './slices/meetingSlice';
import agendaReducer from './slices/agenda/agendaSlice';
import topicsReducer from './slices/topicsSlice.ts';
import selfGuidedTasksReducer from './slices/selfGuidedTasksSlice';
import interviewQuestionsReducer from './slices/interviewQuestions/interviewQuestionsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  meeting: meetingReducer,
  agenda: agendaReducer,
  topics: topicsReducer,
  selfGuidedTasks: selfGuidedTasksReducer,
  interviewQuestions: interviewQuestionsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
