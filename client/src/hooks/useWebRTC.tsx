import { useState, useCallback, useRef, useEffect } from "react";
import { createPeerConnection, handleOffer, handleAnswer, handleIceCandidate } from "@/lib/webrtc";

export function useWebRTC(socket: WebSocket | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const currentPeerIdRef = useRef<string>("");
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Initialize local media
  useEffect(() => {
    initializeLocalMedia();

    return () => {
      cleanupStreams();
    };
  }, []);

  // Sync peersRef with peers state
  useEffect(() => {
    peersRef.current = new Map(peers);
  }, [peers]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "offer":
          handleIncomingOffer(message);
          break;
        case "answer":
          handleIncomingAnswer(message);
          break;
        case "ice-candidate":
          handleIncomingIceCandidate(message);
          break;
        case "participant-joined":
          handleParticipantJoined(message);
          break;
        case "participant-left":
          handleParticipantLeft(message);
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  const initializeLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const cleanupStreams = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());

    peersRef.current.forEach(peer => peer.close());
    peersRef.current.clear();
    setPeers(new Map());
  };

  const joinRoom = useCallback((roomCode: string, peerId: string, name: string, isHost: boolean) => {
    currentPeerIdRef.current = peerId;

    if (socket) {
      socket.send(JSON.stringify({
        type: "join-room",
        roomCode,
        peerId,
        name,
        isHost,
      }));
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.send(JSON.stringify({
        type: "leave-room",
      }));
    }

    cleanupStreams();
  }, [socket]);

  const handleParticipantJoined = async (message: any) => {
    const { participant } = message;

    if (participant.peerId === currentPeerIdRef.current) return;

    const peer = await createPeerConnection(
      localStreamRef.current,
      (candidate) => {
        if (socket) {
          socket.send(JSON.stringify({
            type: "ice-candidate",
            targetPeerId: participant.peerId,
            candidate,
          }));
        }
      }
    );

    // Update both the ref and the state
    peersRef.current.set(participant.peerId, peer);
    setPeers(new Map(peersRef.current));

    // Create offer for new participant
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    if (socket) {
      socket.send(JSON.stringify({
        type: "offer",
        targetPeerId: participant.peerId,
        offer,
      }));
    }
  };

  const handleParticipantLeft = (message: any) => {
    const { peerId } = message;

    const peer = peersRef.current.get(peerId);
    if (peer) {
      peer.close();
      peersRef.current.delete(peerId);
      setPeers(new Map(peersRef.current));
    }
  };

  const handleIncomingOffer = async (message: any) => {
    const { fromPeerId, offer } = message;

    const peer = await createPeerConnection(
      localStreamRef.current,
      (candidate) => {
        if (socket) {
          socket.send(JSON.stringify({
            type: "ice-candidate",
            targetPeerId: fromPeerId,
            candidate,
          }));
        }
      }
    );

    // Update both the ref and the state
    peersRef.current.set(fromPeerId, peer);
    setPeers(new Map(peersRef.current));

    const answer = await handleOffer(peer, offer);

    if (socket) {
      socket.send(JSON.stringify({
        type: "answer",
        targetPeerId: fromPeerId,
        answer,
      }));
    }
  };

  const handleIncomingAnswer = async (message: any) => {
    const { fromPeerId, answer } = message;
    const peer = peersRef.current.get(fromPeerId);

    if (peer) {
      await handleAnswer(peer, answer);
    }
  };

  const handleIncomingIceCandidate = async (message: any) => {
    const { fromPeerId, candidate } = message;
    const peer = peersRef.current.get(fromPeerId);

    if (peer) {
      await handleIceCandidate(peer, candidate);
    }
  };

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);

        // Notify other participants
        if (socket) {
          socket.send(JSON.stringify({
            type: "participant-update",
            updates: { isMuted: !audioTrack.enabled },
          }));
        }
      }
    }
  }, [socket]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setHasVideo(videoTrack.enabled);

        // Notify other participants
        if (socket) {
          socket.send(JSON.stringify({
            type: "participant-update",
            updates: { hasVideo: videoTrack.enabled },
          }));
        }
      }
    }
  }, [socket]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        setScreenStream(null);
        screenStreamRef.current = null;
        setIsScreenSharing(false);

        // Switch back to camera
        if (localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (videoTrack) {
            // Replace screen share track with camera track in all peer connections
            peersRef.current.forEach(async (peer) => {
              const sender = peer.getSenders().find(s => 
                s.track && s.track.kind === 'video'
              );
              if (sender) {
                await sender.replaceTrack(videoTrack);
              }
            });
          }
        }
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        setScreenStream(screenStream);
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);

        const videoTrack = screenStream.getVideoTracks()[0];

        // Replace camera track with screen share track in all peer connections
        peersRef.current.forEach(async (peer) => {
          const sender = peer.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        });

        // Handle screen share end
        videoTrack.onended = () => {
          toggleScreenShare();
        };
      }

      // Notify other participants
      if (socket) {
        socket.send(JSON.stringify({
          type: "participant-update",
          updates: { isScreenSharing: !isScreenSharing },
        }));
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  }, [isScreenSharing, socket, peers]);

  return {
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
    leaveRoom,
  };
}
