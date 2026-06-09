import { Server as SocketServer } from 'socket.io';
import { createServer } from 'http';

const PORT = 3003;

const httpServer = createServer();
const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Track online users
const onlineUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(`[Chat Service] Client connected: ${socket.id}`);

  // User comes online
  socket.on('user:online', (userId: string) => {
    onlineUsers.set(userId, socket.id);
    io.emit('presence:update', { userId, isOnline: true });
    console.log(`[Chat Service] User online: ${userId}`);
  });

  // User goes offline
  socket.on('user:offline', (userId: string) => {
    onlineUsers.delete(userId);
    io.emit('presence:update', { userId, isOnline: false });
    console.log(`[Chat Service] User offline: ${userId}`);
  });

  // Send message
  socket.on('message:send', (data: {
    chatId: string;
    senderId: string;
    content: string;
    messageType: string;
  }) => {
    // Broadcast to all clients in the chat room
    io.emit('message:receive', {
      id: `msg-${Date.now()}`,
      ...data,
      isRead: false,
      isDelivered: false,
      reactions: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    console.log(`[Chat Service] Message in ${data.chatId} from ${data.senderId}`);
  });

  // Typing indicator
  socket.on('typing:start', (data: { chatId: string; userId: string }) => {
    io.emit('typing:update', { chatId: data.chatId, userId: data.userId, isTyping: true });
  });

  socket.on('typing:stop', (data: { chatId: string; userId: string }) => {
    io.emit('typing:update', { chatId: data.chatId, userId: data.userId, isTyping: false });
  });

  // Read receipt
  socket.on('message:read', (data: { chatId: string; messageId: string; userId: string }) => {
    io.emit('message:readReceipt', data);
  });

  // Call signaling
  socket.on('call:initiate', (data: {
    callerId: string;
    receiverId: string;
    callType: string;
    callId: string;
  }) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.emit('call:incoming', data);
    }
  });

  socket.on('call:answer', (data: { callId: string; accept: boolean }) => {
    io.emit('call:response', data);
  });

  socket.on('call:end', (data: { callId: string }) => {
    io.emit('call:ended', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Find and remove the user
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('presence:update', { userId, isOnline: false });
        break;
      }
    }
    console.log(`[Chat Service] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Chat Service] WebSocket server running on port ${PORT}`);
});
