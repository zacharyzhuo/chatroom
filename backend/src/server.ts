const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
import { ChatMessage } from './types';

const PORT = 3030;
const NEW_MESSAGE_EVENT = "new-message-event";

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: true,
    origins: ["localhost:3000"]
});

app.use(cors());

// 預設聊天室
const room = "general"
// 建立連線時
io.on("connection", (socket: any) => {
    socket.join(room);

    // 收到訊息時
    socket.on(NEW_MESSAGE_EVENT, (data: ChatMessage) => {
        io.in(room).emit(NEW_MESSAGE_EVENT, data);
    });

    // 結束連線時
    socket.on("disconnect", () => {
        socket.leave(room);
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});