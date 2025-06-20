import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertRoomSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  peerId?: string;
  roomId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for signaling
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const clients = new Map<string, WebSocketClient>();

  // Room management API
  app.post('/api/rooms', async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid room data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create room' });
      }
    }
  });

  app.get('/api/rooms/:code', async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.code);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get room' });
    }
  });

  app.get('/api/rooms/:code/participants', async (req, res) => {
    try {
      const participants = await storage.getParticipantsByRoom(req.params.code);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get participants' });
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocketClient) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join-room':
            await handleJoinRoom(ws, message);
            break;
          case 'leave-room':
            await handleLeaveRoom(ws, message);
            break;
          case 'offer':
          case 'answer':
          case 'ice-candidate':
            handleWebRTCSignaling(ws, message);
            break;
          case 'chat-message':
            handleChatMessage(ws, message);
            break;
          case 'participant-update':
            await handleParticipantUpdate(ws, message);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      handleDisconnect(ws);
    });
  });

  async function handleJoinRoom(ws: WebSocketClient, message: any) {
    try {
      const { roomCode, peerId, name, isHost } = message;
      
      // Verify room exists
      const room = await storage.getRoom(roomCode);
      if (!room) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        return;
      }

      // Add participant to storage
      const participant = await storage.addParticipant({
        roomId: roomCode,
        peerId,
        name,
        isHost: isHost || false,
        isMuted: false,
        hasVideo: true,
        isScreenSharing: false,
      });

      ws.peerId = peerId;
      ws.roomId = roomCode;
      clients.set(peerId, ws);

      // Notify existing participants
      broadcastToRoom(roomCode, {
        type: 'participant-joined',
        participant,
      }, peerId);

      // Send current participants to new user
      const participants = await storage.getParticipantsByRoom(roomCode);
      ws.send(JSON.stringify({
        type: 'room-joined',
        participants: participants.filter(p => p.peerId !== peerId),
      }));

    } catch (error) {
      console.error('Error joining room:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to join room' }));
    }
  }

  async function handleLeaveRoom(ws: WebSocketClient, message: any) {
    if (ws.peerId && ws.roomId) {
      await storage.removeParticipant(ws.peerId);
      
      broadcastToRoom(ws.roomId, {
        type: 'participant-left',
        peerId: ws.peerId,
      }, ws.peerId);

      clients.delete(ws.peerId);
      ws.peerId = undefined;
      ws.roomId = undefined;
    }
  }

  function handleWebRTCSignaling(ws: WebSocketClient, message: any) {
    const { targetPeerId, ...signalData } = message;
    const targetClient = clients.get(targetPeerId);
    
    if (targetClient && targetClient.readyState === WebSocket.OPEN) {
      targetClient.send(JSON.stringify({
        ...signalData,
        fromPeerId: ws.peerId,
      }));
    }
  }

  function handleChatMessage(ws: WebSocketClient, message: any) {
    if (ws.roomId) {
      broadcastToRoom(ws.roomId, {
        type: 'chat-message',
        message: message.message,
        fromPeerId: ws.peerId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async function handleParticipantUpdate(ws: WebSocketClient, message: any) {
    if (ws.peerId) {
      const { updates } = message;
      await storage.updateParticipant(ws.peerId, updates);
      
      if (ws.roomId) {
        broadcastToRoom(ws.roomId, {
          type: 'participant-updated',
          peerId: ws.peerId,
          updates,
        }, ws.peerId);
      }
    }
  }

  function handleDisconnect(ws: WebSocketClient) {
    if (ws.peerId && ws.roomId) {
      storage.removeParticipant(ws.peerId);
      
      broadcastToRoom(ws.roomId, {
        type: 'participant-left',
        peerId: ws.peerId,
      }, ws.peerId);

      clients.delete(ws.peerId);
    }
  }

  function broadcastToRoom(roomId: string, message: any, excludePeerId?: string) {
    // @ts-ignore
    for (const [peerId, client] of clients) {
      if (client.roomId === roomId && peerId !== excludePeerId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }

  return httpServer;
}
