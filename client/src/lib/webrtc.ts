const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export async function createPeerConnection(
  localStream: MediaStream | null,
  onIceCandidate: (candidate: RTCIceCandidate) => void
): Promise<RTCPeerConnection> {
  const peer = new RTCPeerConnection({ iceServers });

  // Add local stream tracks
  if (localStream) {
    localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream);
    });
  }

  // Handle ICE candidates
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  return peer;
}

export async function handleOffer(
  peer: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> {
  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return answer;
}

export async function handleAnswer(
  peer: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
): Promise<void> {
  await peer.setRemoteDescription(answer);
}

export async function handleIceCandidate(
  peer: RTCPeerConnection,
  candidate: RTCIceCandidateInit
): Promise<void> {
  await peer.addIceCandidate(candidate);
}
