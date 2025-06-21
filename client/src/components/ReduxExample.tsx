import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser, updateSettings, selectUser } from '../store/slices/userSlice';
import { joinMeeting, leaveMeeting, toggleChat, selectMeeting } from '../store/slices/meetingSlice';

const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const meeting = useAppSelector(selectMeeting);

  // Example handlers for user actions
  const handleLogin = () => {
    dispatch(setUser({ userId: 'user123', name: 'John Doe' }));
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const toggleAudio = () => {
    dispatch(updateSettings({ audio: !user.settings.audio }));
  };

  // Example handlers for meeting actions
  const handleJoinMeeting = () => {
    dispatch(joinMeeting({ roomId: 'room123' }));
  };

  const handleLeaveMeeting = () => {
    dispatch(leaveMeeting());
  };

  const handleToggleChat = () => {
    dispatch(toggleChat());
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Redux State Example</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">User State</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleLogin}
            className="px-3 py-1 bg-blue-500 text-white rounded"
            disabled={user.isAuthenticated}
          >
            Login
          </button>
          <button 
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded"
            disabled={!user.isAuthenticated}
          >
            Logout
          </button>
          <button 
            onClick={toggleAudio}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Toggle Audio
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Meeting State</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(meeting, null, 2)}
        </pre>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleJoinMeeting}
            className="px-3 py-1 bg-green-500 text-white rounded"
            disabled={meeting.isActive}
          >
            Join Meeting
          </button>
          <button 
            onClick={handleLeaveMeeting}
            className="px-3 py-1 bg-red-500 text-white rounded"
            disabled={!meeting.isActive}
          >
            Leave Meeting
          </button>
          <button 
            onClick={handleToggleChat}
            className="px-3 py-1 bg-purple-500 text-white rounded"
            disabled={!meeting.isActive}
          >
            Toggle Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReduxExample;