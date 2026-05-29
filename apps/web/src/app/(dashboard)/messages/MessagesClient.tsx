"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Search, 
  User, 
  Circle, 
  ShieldAlert, 
  Sparkles,
  MessageSquare
} from "lucide-react";
import { io } from "socket.io-client";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  time: string;
  isSelf: boolean;
}

interface Athlete {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage?: string;
  unread?: boolean;
}

interface MessagesClientProps {
  user: any;
}

export function MessagesClient({ user }: MessagesClientProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete>({
    id: "mock-elena",
    name: "Elena Rossi",
    role: "Sports Psychologist",
    avatar: "E",
    status: "online",
  });

  const [athletes, setAthletes] = useState<Athlete[]>([
    {
      id: "mock-elena",
      name: "Elena Rossi",
      role: "Sports Psychologist",
      avatar: "E",
      status: "online",
      lastMessage: "Make sure you focus on your breathing recovery metrics today!",
    },
    {
      id: "mock-sarah",
      name: "Dr. Sarah Chen",
      role: "Sports Scientist",
      avatar: "S",
      status: "online",
      lastMessage: "I reviewed your squat PR log. Try adjusting your stance slightly wider.",
    },
    {
      id: "mock-julian",
      name: "Chef Julian",
      role: "FitSync Culinary",
      avatar: "J",
      status: "offline",
      lastMessage: "The high-protein meal prep recipes are updated in your Nutrition Hub.",
    },
  ]);

  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    "mock-elena": [
      {
        id: "1",
        senderId: "mock-elena",
        senderName: "Elena Rossi",
        receiverId: user?.id || "user-id",
        content: "Hi there! How are you feeling mentally after your high-intensity threshold workouts this week?",
        time: "10:30 AM",
        isSelf: false,
      },
      {
        id: "2",
        senderId: user?.id || "user-id",
        senderName: user?.name || "Me",
        receiverId: "mock-elena",
        content: "Hey Elena! The physical fatigue is definitely high, but I'm staying focused. Slept around 7.5 hours last night.",
        time: "10:35 AM",
        isSelf: true,
      },
      {
        id: "3",
        senderId: "mock-elena",
        senderName: "Elena Rossi",
        receiverId: user?.id || "user-id",
        content: "That sleep duration is perfect. Make sure you focus on your breathing recovery metrics today!",
        time: "10:36 AM",
        isSelf: false,
      },
    ],
    "mock-sarah": [
      {
        id: "1",
        senderId: "mock-sarah",
        senderName: "Dr. Sarah Chen",
        receiverId: user?.id || "user-id",
        content: "Hello! I reviewed your squat PR log. Try adjusting your stance slightly wider.",
        time: "Yesterday",
        isSelf: false,
      },
    ],
    "mock-julian": [
      {
        id: "1",
        senderId: "mock-julian",
        senderName: "Chef Julian",
        receiverId: user?.id || "user-id",
        content: "The high-protein meal prep recipes are updated in your Nutrition Hub.",
        time: "2 days ago",
        isSelf: false,
      },
    ],
  });

  const [newMessageText, setNewMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const socketRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when active conversation updates
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedAthlete.id]);

  useEffect(() => {
    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    const setupSocket = (socket: any) => {
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Messages Client connected to Socket.io server");
        if (user?.id) {
          socket.emit("join-user", user.id);
        }
      });

      socket.on("receive-direct-message", (data: any) => {
        console.log("Received direct message:", data);
        const incomingMsg: Message = {
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          senderId: data.senderId,
          senderName: data.senderName,
          receiverId: data.receiverId,
          content: data.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: false,
        };

        // Add to the appropriate conversation history
        const partnerId = data.senderId;
        setConversations((prev) => {
          const currentChat = prev[partnerId] || [];
          return {
            ...prev,
            [partnerId]: [...currentChat, incomingMsg],
          };
        });

        // Update the athlete list's last message and set unread status if not currently viewing
        setAthletes((prev) =>
          prev.map((ath) => {
            if (ath.id === partnerId) {
              return {
                ...ath,
                lastMessage: data.content,
                unread: selectedAthlete.id !== partnerId,
              };
            }
            return ath;
          })
        );
      });
    };

    if (socketServerUrl) {
      const socket = io(socketServerUrl, {
        transports: ["websocket"],
      });
      setupSocket(socket);
    } else {
      fetch("/api/socket").finally(() => {
        const socket = io({
          path: "/api/socket",
        });
        setupSocket(socket);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?.id, selectedAthlete.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: Message = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      senderId: user?.id || "user-id",
      senderName: user?.name || "Me",
      receiverId: selectedAthlete.id,
      content: newMessageText,
      time: timestamp,
      isSelf: true,
    };

    // Update conversation local state
    setConversations((prev) => {
      const currentChat = prev[selectedAthlete.id] || [];
      return {
        ...prev,
        [selectedAthlete.id]: [...currentChat, msg],
      };
    });

    // Update last message in the list
    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id === selectedAthlete.id) {
          return {
            ...ath,
            lastMessage: newMessageText,
          };
        }
        return ath;
      })
    );

    // Emit via Socket.io
    if (socketRef.current) {
      socketRef.current.emit("direct-message", {
        senderId: user?.id || "user-id",
        senderName: user?.name || "Me",
        receiverId: selectedAthlete.id,
        content: newMessageText,
        time: timestamp,
      });
    }

    setNewMessageText("");
  };

  const handleSelectAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id === athlete.id) {
          return {
            ...ath,
            unread: false,
          };
        }
        return ath;
      })
    );
  };

  const filteredAthletes = athletes.filter((ath) =>
    ath.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ath.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessages = conversations[selectedAthlete.id] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
      {/* Sidebar - Contacts List */}
      <Card className="lg:col-span-1 p-6 glass border-white/5 rounded-[2rem] flex flex-col h-full space-y-4">
        <div className="space-y-2">
          <h2 className="font-bold font-heading text-lg text-white">Contacts</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-none h-10 pl-9 text-xs focus-visible:ring-secondary/40 text-white placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredAthletes.map((ath) => (
            <button
              key={ath.id}
              onClick={() => handleSelectAthlete(ath)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                selectedAthlete.id === ath.id
                  ? "bg-secondary/10 border-secondary/30 text-white"
                  : "bg-white/5 border-white/5 hover:border-white/10 text-muted-foreground hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 rounded-xl bg-white/5 flex shrink-0 items-center justify-center font-bold text-white border border-white/5">
                  {ath.avatar}
                  {ath.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-xs truncate ${selectedAthlete.id === ath.id ? "text-white" : "text-slate-200"}`}>{ath.name}</p>
                  <p className="text-[9px] text-muted-foreground font-semibold mt-0.5 truncate">{ath.role}</p>
                  {ath.lastMessage && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px] font-medium">{ath.lastMessage}</p>
                  )}
                </div>
              </div>
              {ath.unread && (
                <div className="h-2 w-2 rounded-full bg-secondary shrink-0 shadow-lg shadow-secondary/55" />
              )}
            </button>
          ))}
          {filteredAthletes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground">No contacts found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Main Chat Window */}
      <Card className="lg:col-span-2 glass border-white/5 rounded-[2rem] flex flex-col h-full overflow-hidden">
        {/* Active Contact Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center font-bold text-white shadow-md">
              {selectedAthlete.avatar}
              {selectedAthlete.status === "online" && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-white">{selectedAthlete.name}</p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{selectedAthlete.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-secondary/15 text-secondary border border-secondary/20 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Coach
            </span>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/10">
          {activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSelf ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {!msg.isSelf && (
                <div className="h-6 w-6 rounded-full bg-white/5 flex shrink-0 items-center justify-center font-bold text-white text-[9px] mb-1">
                  {selectedAthlete.avatar}
                </div>
              )}
              <div
                className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.isSelf
                    ? "bg-secondary text-primary font-semibold rounded-br-none shadow-lg shadow-secondary/10"
                    : "bg-white/5 border border-white/5 text-slate-200 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-[8px] text-right font-mono mt-1 ${
                    msg.isSelf ? "text-primary/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-6 bg-black/20 border-t border-white/5 flex gap-3">
          <Input
            placeholder="Type your message..."
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            className="bg-white/5 border-none h-11 text-xs focus-visible:ring-secondary/40 text-white placeholder:text-muted-foreground flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessageText.trim()}
            className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl w-11 h-11 p-0 flex items-center justify-center shadow-lg shadow-secondary/15 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
