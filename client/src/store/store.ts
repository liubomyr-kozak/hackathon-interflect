import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import thunk from 'redux-thunk';

// Import reducers here
import userReducer from './slices/userSlice';
import meetingReducer from './slices/meetingSlice';

// Define the root reducer
const rootReducer = combineReducers({
  // Add reducers here
  user: userReducer,
  meeting: meetingReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  // Whitelist (Save specific reducers)
  // whitelist: ['example'],
  // Blacklist (Don't save specific reducers)
  // blacklist: ['someReducer'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
