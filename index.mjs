import Koa from "koa";
import { createServer } from "http";
import { Server } from "socket.io";
import { enterTheRoom, getRivalId, leaveTheRoom } from "./room.mjs";

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // 进入房间
  socket.on("enterRoom", (roomId) => {
    const result = enterTheRoom(socket, roomId);
    socket.emit("enterRoom", !!result);
    // 通知双方，双方上线
    if (result === 2) {
      const rivalId = getRivalId(socket);
      socket.to(rivalId).emit("rivalOnline");
      socket.emit("rivalOnline");
    }
  });

  // 接收游戏指令
  socket.on("game", (...msg) => {
    // socket.emit("game", ...msg);
    const rivalId = getRivalId(socket);
    console.log(socket.id, rivalId, ...msg);
    if (rivalId) {
      socket.to(rivalId).emit("game", ...msg);
    }
  });

  socket.on("disconnect", () => {
    const result = leaveTheRoom(socket);
    if (result) {
      const rivalId = getRivalId(socket);
      socket.to(rivalId).emit("rivalOffline");
    }
  });
});

httpServer.listen(4567);
