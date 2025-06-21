import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addChatMessage, selectChatMessagesByRoom } from "@/store/slices/meetingSlice";

interface ReduxChatSidebarProps {
  onSendMessage: (message: string) => void;
  currentUser: string;
}

export default function ReduxChatSidebar({ onSendMessage, currentUser }: ReduxChatSidebarProps) {
  const [messageText, setMessageText] = useState("");
  const chatMessages = useAppSelector(selectChatMessagesByRoom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {msg.senderName?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!messageText.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
