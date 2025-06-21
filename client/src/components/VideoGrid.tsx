import { useEffect, useRef } from "react";
import type { Participant } from "@shared/schema";

interface VideoGridProps {
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  peers: Map<string, RTCPeerConnection>;
  participants: Participant[];
  isScreenSharing: boolean;
}

export default function VideoGrid({ 
  localStream, 
  screenStream, 
  peers, 
  participants,
  isScreenSharing 
}: VideoGridProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  const getParticipantName = (peerId: string) => {
    const participant = participants.find(p => p.peerId === peerId);
    return participant?.name || "Unknown";
  };

  const getParticipantStatus = (peerId: string) => {
    const participant = participants.find(p => p.peerId === peerId);
    return {
      isMuted: participant?.isMuted || false,
      hasVideo: participant?.hasVideo || true,
      isScreenSharing: participant?.isScreenSharing || false,
    };
  };

  return (
    <div className="h-full p-4">
      <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Video Area */}
        <div className="lg:col-span-4 relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          {isScreenSharing && screenStream ? (
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">YOU</span>
                </div>
                <p className="text-lg">Camera is off</p>
              </div>
            </div>
          )}

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Speaker Info */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">You</span>
                {isScreenSharing && <span className="text-xs text-gray-300">Screen Sharing</span>}
              </div>
            </div>
          </div>

          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-medium">
              <i className="fas fa-desktop mr-2"></i>
              Screen Sharing
            </div>
          )}
        </div>

        {/* Participant Thumbnails */}
        <div className="space-y-4">
          {Array.from(peers.entries()).map(([peerId, peer]) => (
            <RemoteVideo 
              key={peerId}
              peerId={peerId}
              peer={peer}
              participantName={getParticipantName(peerId)}
              participantStatus={getParticipantStatus(peerId)}
            />
          ))}
          
          {/*{Array.from({ length: peers.size }).map((_, index) => (*/}
          {/*  <div key={`empty-${index}`} className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">*/}
          {/*    <div className="text-center text-gray-400">*/}
          {/*      <i className="fas fa-user text-2xl mb-2"></i>*/}
          {/*      <p className="text-sm">Waiting for participants...</p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
      </div>
    </div>
  );
}

function RemoteVideo({ 
  peerId, 
  peer, 
  participantName, 
  participantStatus 
}: { 
  peerId: string;
  peer: RTCPeerConnection;
  participantName: string;
  participantStatus: { isMuted: boolean; hasVideo: boolean; isScreenSharing: boolean };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleTrack = (event: RTCTrackEvent) => {
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    peer.addEventListener('track', handleTrack);
    
    return () => {
      peer.removeEventListener('track', handleTrack);
    };
  }, [peer]);

  return (
    <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group hover:ring-2 hover:ring-primary transition-all duration-200">
      {participantStatus.hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-lg">
                {participantName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white text-xs font-medium">{participantName}</span>
          </div>
        </div>
      )}
      
      {/* Participant Info */}
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
        <span className="text-white text-xs font-medium">{participantName}</span>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute top-2 right-2 flex space-x-1">
        {participantStatus.isMuted && (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <i className="fas fa-microphone-slash text-white text-xs"></i>
          </div>
        )}
        {!participantStatus.hasVideo && (
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
            <i className="fas fa-video-slash text-white text-xs"></i>
          </div>
        )}
      </div>
    </div>
  );
}
