import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Users,  MessagesSquare, MonitorUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import ReduxExample from "@/components/ReduxExample";


export default function Home() {
  const [, setLocation] = useLocation();
  const [joinCode, setJoinCode] = useState("");

  const { toast } = useToast();

  const createRoomMutation = useMutation({
    mutationFn: async (data: { code: string}) => {
      const res = await apiRequest("POST", "/api/rooms", data);
      return res.json();
    },
    onSuccess: (room) => {
      setLocation(`/room/${room.code}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();

    createRoomMutation.mutate({
      code: uuidv4(),
    });
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }


    setLocation(`/room/${joinCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Interflect</h1>
          </div>
          <p className="text-xl text-gray-600">Next-Gen Interview Platform</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold">Start Meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <Input
                    className="flex-1 focus-visible:outline-none focus-visible:ring-0"
                    placeholder="Enter a code or link"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    className={
                      joinCode
                          ? "px-6 py-3 text-base font-semibold rounded-md bg-primary text-white hover:bg-primary/90 transition"
                          : "px-6 py-3 bg-secondary text-black hover:bg-muted/50 transition"
                    }
                    disabled={!joinCode}
                >
                  Join
                </Button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-muted" />
                <span className="mx-4 text-sm text-muted-foreground">or</span>
                <div className="flex-grow border-t border-muted" />
              </div>
              <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleCreateRoom}
              >
                <Video className="w-5 h-5" />
                New Meeting
              </Button>
            </CardContent>
          </Card>
        </div>


        {/* Features */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">HD Video</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">Multi-user</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-desktop text-primary">
                  <MonitorUp />
                </i>
              </div>
              <span className="text-sm font-medium text-gray-700">Screen Share</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-comments text-primary">
                  <MessagesSquare />
                </i>
              </div>
              <span className="text-sm font-medium text-gray-700">Real-time Chat</span>
            </div>
          </div>
        </div>

        {/* Redux Example */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-4">Redux State Management Demo</h2>
          <ReduxExample />
        </div>
      </div>
    </div>
  );
}
