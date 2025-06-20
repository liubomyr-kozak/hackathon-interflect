import {   type Room, type InsertRoom, type Participant, type InsertParticipant } from "@shared/schema";

export interface IStorage {
  // Room operations
  createRoom(room: InsertRoom): Promise<Room>;
  getRoom(code: string): Promise<Room | undefined>;
  getRoomById(id: number): Promise<Room | undefined>;
  updateRoom(id: number, updates: Partial<Room>): Promise<Room | undefined>;
  
  // Participant operations
  addParticipant(participant: InsertParticipant): Promise<Participant>;
  getParticipantsByRoom(roomId: string): Promise<Participant[]>;
  getParticipant(peerId: string): Promise<Participant | undefined>;
  updateParticipant(peerId: string, updates: Partial<Participant>): Promise<Participant | undefined>;
  removeParticipant(peerId: string): Promise<void>;
  removeParticipantsByRoom(roomId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private rooms: Map<number, Room>;
  private participants: Map<string, Participant>;
  private currentRoomId: number;
  private currentParticipantId: number;

  constructor() {
    this.rooms = new Map();
    this.participants = new Map();
    this.currentRoomId = 1;
    this.currentParticipantId = 1;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const room: Room = {
      ...insertRoom,
      id,
      createdAt: new Date(),
      isActive: insertRoom.isActive ?? true,
    };

    console.log("😜😜😜 MemStorage::createRoom -> room", room);

    this.rooms.set(id, room);
    return room;
  }

  async getRoom(code: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(room => room.code === code);
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async updateRoom(id: number, updates: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async addParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const id = this.currentParticipantId++;
    const participant: Participant = {
      ...insertParticipant,
      id,
      joinedAt: new Date(),
      isHost: insertParticipant.isHost ?? false,
      isMuted: insertParticipant.isMuted ?? false,
      hasVideo: insertParticipant.hasVideo ?? false,
      isScreenSharing: insertParticipant.isScreenSharing ?? false,
    };
    this.participants.set(participant.peerId, participant);
    return participant;
  }

  async getParticipantsByRoom(roomId: string): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      participant => participant.roomId === roomId
    );
  }

  async getParticipant(peerId: string): Promise<Participant | undefined> {
    return this.participants.get(peerId);
  }

  async updateParticipant(peerId: string, updates: Partial<Participant>): Promise<Participant | undefined> {
    const participant = this.participants.get(peerId);
    if (!participant) return undefined;
    
    const updatedParticipant = { ...participant, ...updates };
    this.participants.set(peerId, updatedParticipant);
    return updatedParticipant;
  }

  async removeParticipant(peerId: string): Promise<void> {
    this.participants.delete(peerId);
  }

  async removeParticipantsByRoom(roomId: string): Promise<void> {
    // @ts-ignore
    for (const [peerId, participant] of this.participants) {
      if (participant.roomId === roomId) {
        this.participants.delete(peerId);
      }
    }
  }
}

export const storage = new MemStorage();
