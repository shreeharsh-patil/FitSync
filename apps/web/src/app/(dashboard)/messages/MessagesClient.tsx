"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Search, 
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { sendMessage, getMessages } from "@/lib/actions";

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
  contacts: Athlete[];
  currentUserId: string;
}

export function MessagesClient({ user, contacts, currentUserId }: MessagesClientProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(
    contacts.length > 0 ? contacts[0] : null
  );
  const [athletes, setAthletes] = useState<Athlete[]>(contacts);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [newMessageText, setNewMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedAthlete?.id]);

  const loadChat = async (contactId: string) => {
    setIsLoadingChat(true);
    const msgs = await getMessages(currentUserId, contactId);
    setConversations((prev) => ({
      ...prev,
      [contactId]: msgs,
    }));
    setIsLoadingChat(false);
  };

  useEffect(() => {
    if (selectedAthlete?.id && !conversations[selectedAthlete.id]) {
      loadChat(selectedAthlete.id);
    }
  }, [selectedAthlete?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedAthlete) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: Message = {
      id: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15),
      senderId: currentUserId,
      senderName: user?.name || "Me",
      receiverId: selectedAthlete.id,
      content: newMessageText,
      time: timestamp,
      isSelf: true,
    };

    setConversations((prev) => {
      const currentChat = prev[selectedAthlete.id] || [];
      return {
        ...prev,
        [selectedAthlete.id]: [...currentChat, msg],
      };
    });

    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id === selectedAthlete.id) {
          return { ...ath, lastMessage: newMessageText };
        }
        return ath;
      })
    );

    await sendMessage(currentUserId, selectedAthlete.id, newMessageText);
    setNewMessageText("");
  };

  const handleSelectAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id === athlete.id) {
          return { ...ath, unread: false };
        }
        return ath;
      })
    );
  };

  const filteredAthletes = athletes.filter((ath) =>
    ath.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ath.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessages = selectedAthlete ? (conversations[selectedAthlete.id] || []) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
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
          {filteredAthletes.length > 0 ? (
            filteredAthletes.map((ath) => (
              <button
                key={ath.id}
                onClick={() => handleSelectAthlete(ath)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  selectedAthlete?.id === ath.id
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
                    <p className={`font-bold text-xs truncate ${selectedAthlete?.id === ath.id ? "text-white" : "text-slate-200"}`}>
                      {ath.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-semibold mt-0.5 truncate">{ath.role}</p>
                    {ath.lastMessage && (
                      <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px] font-medium">
                        {ath.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
                {ath.unread && (
                  <div className="h-2 w-2 rounded-full bg-secondary shrink-0 shadow-lg shadow-secondary/55" />
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8 space-y-3">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">No contacts yet</p>
              <p className="text-[9px] text-muted-foreground/60">Other athletes will appear here once they join</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="lg:col-span-2 glass border-white/5 rounded-[2rem] flex flex-col h-full overflow-hidden">
        {selectedAthlete ? (
          <>
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
              <span className="text-[10px] bg-secondary/15 text-secondary border border-secondary/20 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Athlete
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/10">
              {isLoadingChat ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              ) : activeMessages.length > 0 ? (
                activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isSelf ? "justify-end" : "justify-start"} items-end gap-2`}
                  >
                    <div
                      className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                        msg.isSelf
                          ? "bg-secondary text-primary font-semibold rounded-br-none shadow-lg shadow-secondary/10"
                          : "bg-white/5 border border-white/5 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[8px] text-right font-mono mt-1 ${msg.isSelf ? "text-primary/70" : "text-muted-foreground"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">No messages yet</p>
                  <p className="text-[9px] text-muted-foreground/60">Send a message to start the conversation</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8">
            <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">Select a contact to start messaging</p>
            <p className="text-xs text-muted-foreground/60">Your conversations will appear here</p>
          </div>
        )}
      </Card>
    </div>
  );
}
