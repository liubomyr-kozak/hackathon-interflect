import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mic, MicOff, Video, VideoOff, Monitor, Crown, ShieldCheck } from "lucide-react";
import type { Participant } from "@shared/schema";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { selectIsAdmin } from "@/store/slices/meetingSlice";

interface ParticipantsSidebarProps {
  participants: Participant[];
  currentUser: string;
}

export default function ParticipantsSidebar({ participants, currentUser }: ParticipantsSidebarProps) {
  const { toast } = useToast();
  const isCurrentUserAdmin = useAppSelector(selectIsAdmin);

  const makeAdmin = async (participant: Participant) => {
    try {
      const response = await fetch(`/api/participants/${participant.peerId}/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to make user admin');
      }

      toast({
        title: "Success",
        description: `${participant.name} is now an admin`,
      });
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: "Failed to make user admin",
        variant: "destructive",
      });
    }
  };
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-3">
        {/* Current User */}
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {currentUser} (You)
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Mic className="text-accent w-3 h-3" />
              <Video className="text-accent w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Other Participants */}
        {participants.map((participant) => (
          <div
            key={participant.peerId}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {participant.name}
                </span>
                {participant.isHost && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Host</span>
                  </span>
                )}
                {participant.isAdmin && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {participant.isMuted ? (
                  <MicOff className="text-red-500 w-3 h-3" />
                ) : (
                  <Mic className="text-accent w-3 h-3" />
                )}
                {participant.hasVideo ? (
                  <Video className="text-accent w-3 h-3" />
                ) : (
                  <VideoOff className="text-red-500 w-3 h-3" />
                )}
                {participant.isScreenSharing && (
                  <Monitor className="text-primary w-3 h-3" />
                )}
              </div>
            </div>
            {isCurrentUserAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!participant.isAdmin && (
                    <DropdownMenuItem onClick={() => makeAdmin(participant)}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Make Admin</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}

        {participants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Waiting for other participants to join...</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
