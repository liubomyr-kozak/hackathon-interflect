# Redux Implementation Guide

This directory contains the Redux implementation for the Interwise application. It includes a Redux store with Redux Persist for minimal storage solution, as well as slices for managing user and meeting state.

## Directory Structure

```
store/
├── hooks.ts           # Typed hooks for using Redux
├── slices/            # Redux slices
│   ├── userSlice.ts   # User state management
│   └── meetingSlice.ts # Meeting state management
└── store.ts           # Store configuration with Redux Persist
```

## Usage

### Using Redux in Components

To use Redux in your components, import the hooks from the `hooks.ts` file:

```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser, setUser } from '@/store/slices/userSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  const handleLogin = () => {
    dispatch(setUser({ userId: 'user123', name: 'John Doe' }));
  };
  
  return (
    <div>
      <p>User: {user.name || 'Not logged in'}</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

### Available Slices

#### User Slice

The user slice manages user-related state:

- `userId`: The ID of the current user
- `name`: The name of the current user
- `isAuthenticated`: Whether the user is authenticated
- `settings`: User settings (audio, video, notifications)

Actions:
- `setUser({ userId, name })`: Set the user information
- `clearUser()`: Clear the user information
- `updateSettings({ audio, video, notifications })`: Update user settings

Selectors:
- `selectUser`: Get the entire user state
- `selectUserId`: Get the user ID
- `selectUserName`: Get the user name
- `selectIsAuthenticated`: Get the authentication status
- `selectUserSettings`: Get the user settings

#### Meeting Slice

The meeting slice manages meeting-related state:

- `roomId`: The ID of the current room
- `isActive`: Whether a meeting is active
- `participants`: List of participants in the meeting
- `chatMessages`: List of chat messages
- `isChatOpen`: Whether the chat UI is open

Actions:
- `joinMeeting({ roomId })`: Join a meeting
- `leaveMeeting()`: Leave the current meeting
- `addParticipant(participant)`: Add a participant to the meeting
- `updateParticipant({ id, ...changes })`: Update a participant
- `removeParticipant({ id })`: Remove a participant
- `addChatMessage(message)`: Add a chat message
- `toggleChat()`: Toggle the chat UI

Selectors:
- `selectMeeting`: Get the entire meeting state
- `selectRoomId`: Get the room ID
- `selectIsActive`: Get whether a meeting is active
- `selectParticipants`: Get the list of participants
- `selectChatMessages`: Get the list of chat messages
- `selectIsChatOpen`: Get whether the chat UI is open

### Redux Persist

The Redux store is configured with Redux Persist to persist the state to localStorage. This provides a minimal storage solution that allows the application to maintain state across page refreshes.

By default, all reducers are persisted. You can customize this by modifying the `persistConfig` in `store.ts`:

```ts
const persistConfig = {
  key: 'root',
  storage,
  // Whitelist (Save specific reducers)
  whitelist: ['user'],
  // Blacklist (Don't save specific reducers)
  // blacklist: ['meeting'],
};
```

## Adding New Slices

To add a new slice:

1. Create a new file in the `slices` directory
2. Define the slice using `createSlice` from Redux Toolkit
3. Export the actions and selectors
4. Import the reducer in `store.ts` and add it to the `rootReducer`

Example:

```ts
// slices/newSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface NewState {
  // Define your state here
}

const initialState: NewState = {
  // Initialize your state here
};

export const newSlice = createSlice({
  name: 'new',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { /* export actions */ } = newSlice.actions;
export const selectNew = (state: RootState) => state.new;
export default newSlice.reducer;
```

Then in `store.ts`:

```ts
import newReducer from './slices/newSlice';

const rootReducer = combineReducers({
  user: userReducer,
  meeting: meetingReducer,
  new: newReducer,
});
```