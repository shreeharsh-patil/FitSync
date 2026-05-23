import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Socket as NetSocket } from "net";

interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log("Socket.io is already running on the server");
    res.end();
    return;
  }

  console.log("Initializing Socket.io server...");
  const io = new SocketIOServer(res.socket.server as any, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket:", socket.id);

    // Listen for new community posts
    socket.on("new-post", (post) => {
      console.log("New post received by server:", post.id);
      // Broadcast the new post to all other connected clients
      socket.broadcast.emit("post-received", post);
    });

    // Listen for hearts/likes
    socket.on("toggle-like", (data) => {
      console.log("Like updated:", data.postId);
      // Broadcast like update to everyone else
      socket.broadcast.emit("like-updated", data);
    });

    // Listen for comments
    socket.on("new-comment", (data) => {
      console.log("New comment added:", data.postId);
      // Broadcast comment addition to everyone else
      socket.broadcast.emit("comment-received", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  res.end();
}
