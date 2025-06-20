import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, MoreVertical, Phone } from "lucide-react";

interface MeetingControlsProps {
  isMuted: boolean;
  hasVideo: boolean;
  isScreenSharing: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeaveMeeting: () => void;
}

export default function MeetingControls({
  isMuted,
  hasVideo,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveMeeting,
}: MeetingControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 flex items-center space-x-2 shadow-2xl border border-white/20">
        {/* Microphone Toggle */}
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 ${
            isMuted 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
          onClick={onToggleMute}
          title={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Camera Toggle */}
        <Button
          variant="secondary"
          size="lg"
          className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 ${
            hasVideo 
              ? "bg-gray-600 hover:bg-gray-700 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          onClick={onToggleVideo}
          title={hasVideo ? "Turn off camera" : "Turn on camera"}
        >
          {hasVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        {/* Screen Share */}
        <Button
          variant="secondary"
          size="lg"
          className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 ${
            isScreenSharing
              ? "bg-primary hover:bg-blue-600 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
          onClick={onToggleScreenShare}
          title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
        >
          {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </Button>

        {/* More Options */}
        <Button
          variant="secondary"
          size="lg"
          className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-xl text-white transition-all duration-200 hover:scale-105"
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>

        {/* Leave Meeting */}
        <Button
          variant="destructive"
          size="lg"
          className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all duration-200 hover:scale-105 ml-4"
          onClick={onLeaveMeeting}
          title="Leave meeting"
        >
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
