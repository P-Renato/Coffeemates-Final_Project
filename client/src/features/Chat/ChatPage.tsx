import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash.debounce";
import type { ChatType, UserType } from "../../utils/types";
import ChatBox from "./ChatBox";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ChatPage() {
    const [auth, setAuth] = useState<{ id: string; username: string } | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const [notifications, setNotifications] = useState<Record<number, number>>({});
    const [lastmessage, setLastmessage] = useState<ChatType[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserType[]>([]);
    const [openChatBox, setOpenChatBox] = useState(false);
    const [chatUserId, setChatUserId] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const navigate = useNavigate();

    const userData = localStorage.getItem("userData");
    const id = userData ? JSON.parse(userData).id : null;
    const username = userData ? JSON.parse(userData).username : null;

    /*************  Load auth user  ******************/
    useEffect(() => {
        if (!id || !username) {
            navigate("/login");
        } else {
            setAuth({ id: id, username });
        }
    }, [id, username, navigate]);

    /***************  Load users + setup socket  ******************/
    useEffect(() => {
        if (!auth) return;

        // Fetch user list
        fetch(`${apiUrl}/api/users/`)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users.filter((u: UserType) => u._id !== auth.id));
            })
            .catch((err) => console.error("User fetch error:", err));

        // Setup socket once
        if (!socketRef.current) {
            socketRef.current = io(apiUrl);
        }
        const socket = socketRef.current;

        socket.emit("register", auth.id);

        const handleNewMessage = (msg: ChatType) => {
            if (msg.receiverId === auth.id) {
                // Only show notification if the chat with sender is NOT open
                if (chatUserId !== msg.senderId) {
                    toast.info(`💬 New message from ${msg.senderUsername}`);

                    setNotifications((prev) => ({
                        ...prev,
                        [msg.senderId]: (prev[msg.senderId] || 0) + 1,
                    }));
                }

                // Update last message preview
                setLastmessage((prev) => {
                    const updated = prev.filter(
                        (m) =>
                            !(
                                (m.senderId === msg.senderId &&
                                    m.receiverId === auth.id) ||
                                (m.senderId === auth.id &&
                                    m.receiverId === msg.senderId)
                            )
                    );
                    return [...updated, msg];
                });
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            // socket.disconnect(); // optional if you want to disconnect on unmount
        };
    }, [auth, chatUserId, navigate]);

    /****************  Load last messages   ******************/
    useEffect(() => {
        if (!auth) return;

        fetch(`${apiUrl}/api/chat/last/${auth.id}`)
            .then(res => res.json())
            .then(data => setLastmessage(Array.isArray(data.lastMessages) ? data.lastMessages : []))
            .catch((err) => {
                console.error("Last message fetch error:", err);
                setLastmessage([]);
            });
    }, [auth]);

    // Open chat
    const openChat = (userId: string) => {
        setChatUserId(userId);
        setOpenChatBox(true);

        // Clear notifications for that user
        setNotifications((prev) => ({ ...prev, [userId]: 0 }));
    };

    /*********************** Search users with live search using debounce  ************/
    // Search users with live search using debounce
    const searchUser = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await fetch(
                `${apiUrl}/api/users/search?q=${encodeURIComponent(searchQuery)}`
            );
            const data = await res.json();
            setSearchResults(data.users);
        } catch (err) {
            console.error("Search error:", err);
        }
    }, []);

    // Debounced version (runs 300ms AFTER user stops typing)
    const debouncedSearch = useMemo(
        () => debounce((value: string) => searchUser(value), 300),
        [searchUser]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };


    if (!auth) return <div>Loading...</div>;

    const displayUsers = searchQuery.trim() ? searchResults : users;

    return (
        <div className="flex min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />

            <div
                className={`mx-auto bg-white rounded-lg shadow-2xl p-6 space-y-6 ${!openChatBox ? "w-[100%]" : "w-[40%]"
                    }`}
            >

                {/* Search */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && searchUser(searchQuery)}
                    placeholder="🔍︎   Search"
                    className="border border-gray-300 p-2 m-2 w-full rounded-3xl"
                />

                {/* User List */}
                <ul className="space-y-2 mt-2">
                    {displayUsers.map((u) => {
                        const lastMsg = lastmessage.find(
                            (m) =>
                                (m.senderId === u._id && m.receiverId === auth.id) ||
                                (m.senderId === auth.id && m.receiverId === u._id)
                        );

                        return (
                            <li
                                key={u._id}
                                className="flex justify-between items-center p-2"
                            >
                                <span className="flex items-center space-x-2 text-gray-800">
                                    <img
                                        onClick={() => openChat(u._id)}
                                        src={u.photoURL ? `http://localhost:4343${u.photoURL}` : 'http://localhost:4343/uploads/profile/sample-photo.jpeg'}
                                        alt={u.username}
                                        className="w-12 h-12 rounded-full cursor-pointer"
                                        onError={(e) => {
                                            e.currentTarget.src = '/default-avatar.png'; // Fallback if image fails to load
                                        }}
                                    />

                                    <span
                                        className="text-green-800 cursor-pointer"
                                        onClick={() => openChat(u._id)}
                                    >
                                        {u.username}
                                    </span>

                                    {notifications[u._id] > 0 && (
                                        <span className="bg-red-500 text-white rounded-full px-2 text-xs">
                                            {notifications[u._id]}
                                        </span>
                                    )}
                                </span>

                                {/* Last Message Preview */}
                                <span className="text-gray-500 text-sm italic">
                                    {!lastMsg
                                        ? "No messages yet"
                                        : lastMsg.senderId === auth.id
                                            ? `You: ${lastMsg.content}`
                                            : lastMsg.content}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* CHAT BOX */}
            {openChatBox && chatUserId !== null && (
                <ChatBox key={chatUserId} id={chatUserId} />
            )}

        </div>
    );
}
