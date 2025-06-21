import { useParams, useSearch, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoGrid from "@/components/VideoGrid";
import MeetingControls from "@/components/MeetingControls";
import ParticipantsSidebar from "@/components/ParticipantsSidebar";
import ReduxChatSidebar from "@/components/ReduxChatSidebar";
import MergedSidebar from "@/components/MergedSidebar";
import { NameInputDialog } from "@/components/NameInputDialog";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Video, Copy, Settings, Users, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Participant } from "@shared/schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addChatMessage, selectChatMessagesByRoom, toggleChat, selectIsAdmin, setAdminStatus, joinMeeting } from "@/store/slices/meetingSlice";

export default function Meeting() {
  const params = useParams();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const roomCode = params.code!;
  const searchParams = new URLSearchParams(search);
  const isHost = searchParams.get("isHost") === "true";

  // Check localStorage for saved name and userId
  const savedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const defaultName = searchParams.get("name") || savedName || "Anonymous";

  // Only show name dialog if no name is saved in localStorage
  const [nameDialogOpen, setNameDialogOpen] = useState(!savedName);
  const [userName, setUserName] = useState(defaultName);
  const [activeTab, setActiveTab] = useState<"participants" | "chat">("participants");
  const isSidebarOpen = true; // Sidebar is always open
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPeerId, setCurrentPeerId] = useState<string>(savedUserId || "");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redux
  const dispatch = useAppDispatch();
  const chatMessages = useAppSelector(selectChatMessagesByRoom);
  const isAdmin = useAppSelector(selectIsAdmin);

  // Fetch room data
  const { data: room, error: roomError } = useQuery({
    queryKey: ["/api/rooms", roomCode],
    queryFn: async () => {
      const res = await fetch(`/api/rooms/${roomCode}`);
      if (!res.ok) throw new Error("Room not found");
      return res.json();
    },
  });

  // Update isAdmin state in Redux when room data is fetched
  useEffect(() => {
    if (room && room.isAdmin !== undefined) {
      dispatch(setAdminStatus(room.isAdmin));
    }
  }, [room, dispatch]);

  const { socket, isConnected, sendMessage } = useWebSocket();
  const { 
    localStream, 
    screenStream,
    peers,
    isMuted,
    hasVideo,
    isScreenSharing,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    joinRoom,
    leaveRoom
  } = useWebRTC(socket);


  // Join room after name is entered
  useEffect(() => {
    if (room && socket && isConnected && !nameDialogOpen) {
      const peerId = Math.random().toString(36).substr(2, 9);
      setCurrentPeerId(peerId);
      joinRoom(roomCode, peerId, userName, isHost);

      // Also update Redux store with room information
      dispatch(joinMeeting({ 
        roomId: roomCode,
        isAdmin: room.isAdmin
      }));
    }
  }, [room, socket, isConnected, roomCode, userName, isHost, joinRoom, nameDialogOpen, dispatch]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;


    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "participant-joined":
          setParticipants(prev => [...prev, message.participant]);
          break;
        case "participant-left":
          setParticipants(prev => prev.filter(p => p.peerId !== message.peerId));
          break;
        case "participant-updated":
          setParticipants(prev => 
            prev.map(p => 
              p.peerId === message.peerId 
                ? { ...p, ...message.updates }
                : p
            )
          );
          break;
        case "room-joined":
          setParticipants(message.participants);
          break;
        case "chat-message":
          // Skip adding messages from the current user to prevent duplicates
          // since we already add them in the sendChatMessage function
          if (message.fromPeerId !== currentPeerId) {
            // Use the senderName from the server
            const senderName = message.senderName || "Participant";

            // Get roomId from the message or use current roomCode as fallback
            const messageRoomId = message.roomId || roomCode;

            dispatch(addChatMessage({
              senderName: senderName,
              content: message.message,
              isPrivate: false,
              roomId: messageRoomId
            }));
          }
          break;
        case "error":
          toast({
            title: "Error",
            description: message.message,
            variant: "destructive",
          });
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, toast, dispatch, participants, currentPeerId]);

  // Handle room not found
  useEffect(() => {
    if (roomError) {
      toast({
        title: "Room not found",
        description: "The meeting room you're trying to join doesn't exist.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [roomError, setLocation, toast]);

  const copyRoomLink = () => {
    const url = `${window.location.origin}/room/${roomCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard",
    });
  };

  const handleLeaveMeeting = () => {
    if (confirm("Are you sure you want to leave the meeting?")) {
      leaveRoom();
      // Redux meetingSlice's leaveMeeting action will clear chat messages when the store is updated
      setLocation("/");
    }
  };

  const sendChatMessage = (message: string) => {
    sendMessage({
      type: "chat-message",
      message,
      fromPeerId: currentPeerId,
      roomId: roomCode, // Include roomId in the message
    });

    // Also add to Redux store for immediate local update
    dispatch(addChatMessage({
      senderName: "You",
      content: message,
      isPrivate: false,
      roomId: roomCode, // Include roomId in the Redux store update
    }));
  };

  // Generate a unique ID based on the user's name and a timestamp
  const generateUserId = (name: string): string => {
    // Create a hash from the name and current timestamp
    const timestamp = Date.now();
    const hash = `${name}-${timestamp}`.split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0) | 0;
    }, 0);

    // Convert to a positive string in base 36 (alphanumeric)
    return Math.abs(hash).toString(36);
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setNameDialogOpen(false);

    // Generate a unique ID if one doesn't exist
    let userId = savedUserId;
    if (!userId) {
      userId = generateUserId(name);
      setCurrentPeerId(userId);
    }

    // Store name and userId in localStorage for future sessions
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', userId);
    }
  };

  if (!room) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Name Input Dialog */}
      <NameInputDialog
        open={nameDialogOpen}
        onOpenChange={setNameDialogOpen}
        onSubmit={handleNameSubmit}
        defaultName={defaultName}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
           <a href="/" className="text-xl font-bold text-gray-900">Interflect</a>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>Room:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{room.code}</span>
            <Button variant="ghost" size="sm" onClick={copyRoomLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent animate-pulse-slow' : 'bg-red-500'}`}></div>
              <span className="text-gray-600 hidden sm:inline">
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
            <div className="text-gray-400">|</div>
            <span className="text-gray-600">{participants.length + 1} participants</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar - Only visible to admin */}
        {isAdmin && (
          <MergedSidebar 
            isAdmin={isAdmin}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        {/* Video Area */}
        <main className="flex-1 bg-gray-900 relative">
          <VideoGrid 
            localStream={localStream}
            screenStream={screenStream}
            peers={peers}
            participants={participants}
            isScreenSharing={isScreenSharing}
          />

          <MeetingControls
            isMuted={isMuted}
            hasVideo={hasVideo}
            isScreenSharing={isScreenSharing}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onLeaveMeeting={handleLeaveMeeting}
          />
        </main>

        {/* Right Sidebar */}
        {isSidebarOpen && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col hidden lg:flex">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
                  activeTab === "participants"
                    ? "text-primary border-b-2 border-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } transition-colors`}
                onClick={() => setActiveTab("participants")}
              >
                <Users className="w-4 h-4" />
                <span>Participants ({participants.length + 1})</span>
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
                  activeTab === "chat"
                    ? "text-primary border-b-2 border-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } transition-colors`}
                onClick={() => {
                  setActiveTab("chat");
                  dispatch(toggleChat());
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
                {chatMessages.length > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {chatMessages.length}
                  </span>
                )}
              </button>
            </div>

            {/* Sidebar Content */}
            {activeTab === "participants" ? (
              <ParticipantsSidebar participants={participants} currentUser={userName} />
            ) : (
              <ReduxChatSidebar 
                onSendMessage={sendChatMessage}
                currentUser={userName}
              />
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
