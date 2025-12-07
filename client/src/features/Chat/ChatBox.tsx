import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import type { ChatType } from "../../utils/types";
import { useAuth } from "../../hooks/useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ChatBox({ id }: { id: string }) {
    const otherId = id;
    const [otherName, setOtherName] = useState("");
    const [otherImg, setOtherImg] = useState("");

    const navigate = useNavigate();
    const { user } = useAuth();
    const auth = user as { id: string; username: string };

    const [messages, setMessages] = useState<ChatType[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [hasMore, setHasMore] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ChatType[]>([]);

    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // --- fetch other user name ---
    useEffect(() => {
        fetch(`${apiUrl}/api/users/${otherId}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data?.user?.id) navigate("/");
                else {
                    setOtherName(data.user.username);
                    setOtherImg(data.user.photoURL || "");
                    
                }
            })
            .catch(() => navigate("/"));
    }, [otherId, navigate, otherImg]);

    // --- initialize socket ---
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(apiUrl);
        }
        const socket = socketRef.current;

        // room key sorted for both users
        const room = `room_${[auth.id, otherId].sort().join("_")}`;
        socket.emit("joinRoom", room);

        socket.on("newMessage", (msg: ChatType) => {
            setMessages((prev) => {
                if (prev.some((m) => m._id === msg._id)) return prev; // ignore duplicates
                return [...prev, msg]; // append newest at the end
            });
        });

        return () => { socket.off("newMessage") };
    }, [auth.id, otherId]);

    // get messages between users at the beginning
    useEffect(() => {
        const fetchInitial = async () => {
            const res = await fetch(
                `${apiUrl}/api/chat/${auth.id}/${otherId}?limit=${limit}&offset=0`
            );
            const data = await res.json();

            if (!data.msgs || data.msgs.length === 0) {
                setHasMore(false);
                return;
            }

            setMessages(data.msgs.reverse()); // oldest → newest
            setOffset(data.msgs.length);
            if (data.msgs.length < limit) setHasMore(false);
        };
        fetchInitial();
    }, [auth.id, otherId]);

    // --- load older messages ---
    const loadMore = async () => {
        const res = await fetch(
            `${apiUrl}/api/chat/${auth.id}/${otherId}?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();

        if (!data.msgs || data.msgs.length === 0) {
            setHasMore(false);
            return;
        }


        setMessages((prev) => {
            const newMsgs = data.msgs
                .reverse() // oldest → newest
                .filter((msg: ChatType) => !prev.some((m) => m._id === msg._id));
            return [...newMsgs, ...prev]; // prepend older messages
        });

        setOffset((prev) => prev + data.msgs.length);
    };

    // --- send message ---
    const sendMessage = () => {
        if (!input.trim()) return;
        const socket = socketRef.current;
        if (!socket) return;

        socket.emit("sendMessage", {
            content: input,
            senderId: auth.id,
            receiverId: otherId,
            senderUsername: auth.username,
        });

        setInput("");
    };


    // --- search messages ---
    const searchMessages = async () => {
        if (!searchQuery.trim()) return setSearchResults([]);

        const res = await fetch(
            `${apiUrl}/api/chat/search/${auth.id}/${otherId}?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        setSearchResults(data.messages);
        console.log("Search results:", data);
    };

    // --- auto-scroll when messages change ---
    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const avatarUrl = otherImg
        ? `http://localhost:4343${otherImg}`
        : 'http://localhost:4343/uploads/profile/sample-photo.jpeg';

    return (
        <div className="mx-auto flex flex-col h-full w-full bg-white border-l border-gray-300 p-6 space-y-4">
            {/* Header */}
            {user && (
                <div className="flex justify-start gap-6 items-center">
                    <div className="flex justify-between items-center gap-2">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover cursor-pointer"
                        />
                        <span className="text-green-800">{otherName}</span>
                    </div>
                </div>

            )}

            {/* Search */}
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchMessages()}
                    placeholder="Search messages"
                    className="border p-2 rounded w-[98%] mb-2"
                />
                <button
                    onClick={searchMessages}
                    className="w-[6em] bg-blue-500 text-white px-3 py-1 rounded-2xl ml-2"
                >
                    Search
                </button>
            </div>

            {/* Messages */}
            <div className="bg-gray-100">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                    {searchQuery ? (
                        searchResults.length ? (
                            searchResults.map((m) => <Message key={m._id} m={m} auth={auth} />)
                        ) : (
                            <p className="text-center text-gray-500">No matching messages</p>
                        )
                    ) : (
                        <>
                            {hasMore && (
                                <p
                                    onClick={loadMore}
                                    className="text-center text-green-600 cursor-pointer"
                                >
                                    Load more...
                                </p>
                            )}
                            {messages.map((m) => (
                                <Message key={m._id} m={m} auth={auth} />
                            ))}
                        </>
                    )}
                </div>

                {/* Input */}
                {!searchQuery && (
                    <div className=" flex justify-between items-center bg-white  m-10">
                        <input
                            className="flex-1 p-2 border border-gray-300 rounded-md outline-none focus:border-gray-500 focus:ring-gray-500 transition"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition cursor-pointer"
                        >
                            ➤
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- message component ---
function Message({ m, auth }: { m: ChatType; auth: { id: string; username: string } }) {
    return (
        <div
            className={`flex ${m.senderId === auth.id ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`p-3 rounded-lg max-w-xs ${m.senderId === auth.id ? "bg-green-300" : "bg-white"
                    }`}
            >
                {/* <div className="text-sm font-medium text-green-600">{m.senderUsername}</div> */}
                <div className="text-sm text-gray-1200">{m.content}</div>
                <div className="text-xs text-gray-400 text-right">
                    {new Date(m.createdAt).toLocaleDateString()}{" "}
                    {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );
}
