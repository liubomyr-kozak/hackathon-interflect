import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types for participants
interface Participant {
  id: string;
  name: string;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

// Define types for chat messages
interface ChatMessage {
  id: string;
  senderName: string;
  content: string;
  timestamp: number;
  isPrivate: boolean;
  recipientId?: string;
  roomId?: string;
}

// Define the state type
interface MeetingState {
  roomId: string | null;
  isActive: boolean;
  isAdmin: boolean;
  participants: Participant[];
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
}

// Define the initial state
const initialState: MeetingState = {
  roomId: null,
  isActive: false,
  isAdmin: false,
  participants: [],
  chatMessages: [],
  isChatOpen: false,
};

// Create the slice
export const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    joinMeeting: (state, action: PayloadAction<{ roomId: string; isAdmin?: boolean }>) => {
      state.roomId = action.payload.roomId;
      state.isActive = true;
      if (action.payload.isAdmin !== undefined) {
        state.isAdmin = action.payload.isAdmin;
      }
    },
    leaveMeeting: (state) => {
      state.roomId = null;
      state.isActive = false;
      state.participants = [];
      state.chatMessages = [];
      state.isChatOpen = false;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);
    },
    updateParticipant: (state, action: PayloadAction<Partial<Participant> & { id: string }>) => {
      const index = state.participants.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.participants[index] = {
          ...state.participants[index],
          ...action.payload,
        };
      }
    },
    removeParticipant: (state, action: PayloadAction<{ id: string }>) => {
      state.participants = state.participants.filter(p => p.id !== action.payload.id);
    },
    addChatMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      // Use the provided roomId or fall back to the current roomId in state
      const roomId = action?.payload?.roomId ?? state?.roomId;

      state.chatMessages.push({
        ...action.payload,
        id: Date.now().toString(), // Simple ID generation
        timestamp: Date.now(),
        roomId: roomId || '',
      });
    },
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    setAdminStatus: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
  },
});

// Export actions
export const {
  joinMeeting,
  leaveMeeting,
  addParticipant,
  updateParticipant,
  removeParticipant,
  addChatMessage,
  toggleChat,
  setAdminStatus,
} = meetingSlice.actions;

// Export selectors
export const selectMeeting = (state: RootState) => state.meeting;
export const selectRoomId = (state: RootState) => state.meeting.roomId;
export const selectIsActive = (state: RootState) => state.meeting.isActive;
export const selectIsAdmin = (state: RootState) => state.meeting.isAdmin;
export const selectParticipants = (state: RootState) => state.meeting.participants;
export const selectChatMessages = (state: RootState) => state.meeting.chatMessages;
export const selectChatMessagesByRoom = (state: RootState) => {
  const roomId = state.meeting.roomId;
  return state.meeting.chatMessages.filter(msg => 
    // Include messages with matching roomId or messages without roomId (for backward compatibility)
    !msg.roomId || msg.roomId === roomId
  );
};
export const selectIsChatOpen = (state: RootState) => state.meeting.isChatOpen;

// Export reducer
export default meetingSlice.reducer;
