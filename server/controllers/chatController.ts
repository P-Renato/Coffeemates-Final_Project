import type { Request, Response } from 'express';
import { Server as SocketIOServer } from "socket.io";
import { Chat } from '../models/Chat';

let initialized = false;

export function initChatSocket(io: SocketIOServer) {
    if (initialized) return;  // prevents double registration
    initialized = true;

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", (userId: string) => {
            socket.data.userId = userId;
        });

        socket.on("joinRoom", (room) => {
            socket.join(room);
            socket.data.currentRoom = room;
        });

        socket.on("sendMessage", async ({ content, senderId, receiverId, senderUsername }) => {
            if (!content) return;

            const message = await Chat.create({ content, senderId, receiverId, senderUsername });

            const room = `room_${[senderId, receiverId].sort().join("_")}`;

            io.to(room).emit("newMessage", message);

            for (const [, s] of io.sockets.sockets) {
                if (s.data.userId === receiverId && s.data.currentRoom !== room) {
                    s.emit("newMessage", message);
                }
            }
        });

        socket.on("leaveRoom", (room) => {
            socket.leave(room);
            delete socket.data.currentRoom;
        });
    });

    console.log("Chat socket initialized");
}

export const getMessagesBetweenUsers = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    //const userId = "69242a10fa983781d76eae55";
    const otherId = req.params.otherId;
    //const otherId = "691cd088e0ec43701f3eed74";

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const msgs = await Chat.find({
        $or: [
            { senderId: userId, receiverId: otherId },
            { senderId: otherId, receiverId: userId }
        ]
    })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    res.json({ msgs }); 
}

export const getLastMessagesForUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ error: "Invalid userId" });

        if (!userId) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        // Find all messages where this user is sender or receiver
        const messages = await Chat.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: -1 });

        // Step 2: Build a map of last message per partner
        const lastMessagesMap = new Map<string, any>();

        for (const msg of messages) {
            const partnerId =
                msg.senderId === userId ? msg.receiverId : msg.senderId;

            if (!lastMessagesMap.has(partnerId)) {
                lastMessagesMap.set(partnerId, msg);
            }
        }
        const lastMessages = Array.from(lastMessagesMap.values());
        res.json({ lastMessages });
    } catch (err: any) {
        console.error("Mongoose Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const searchMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const otherId = req.params.otherId;
        const q = req.query.q as string;
        
        if (!userId || !otherId) {
            return res.status(400).json({ error: "Invalid userId or partnerId" });
        }

        if (!q || typeof q !== "string") {
            return res.status(400).json({ error: "Missing search query" });
        }

        const messages = await Chat.find({
            content: { $regex: q, $options: "i" }, // case-insensitive search
            $or: [
                { senderId: userId, receiverId: otherId },
                { senderId: otherId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 }); // oldest first
        console.log("Search query:", q, "Found messages:", messages.length);
        res.json({messages}); 
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
