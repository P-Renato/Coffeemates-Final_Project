import { useState, useEffect, type FormEvent } from "react"
import type { CommentType } from "../../utils/types";
import { useAuth } from "../../hooks/useAuth";

// create a .env file in client with VITE_API_URL=http://localhost:4343
const apiUrl = import.meta.env.VITE_API_URL;
export default function CommentList({ pid }: { pid: string }) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState("");
    const { user } = useAuth();

    // Editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    // Load all comments
    useEffect(() => {
        fetch(`${apiUrl}/api/comment/post/${pid}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.comments)) {
                    setComments(data.comments);
                }
            })
            .catch((err) => console.log("Fetching comment error ", err));
    }, [pid]);

    // Add a comment
    const commentHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !user.id) {
            return alert("User is not authenticated.");
        }
        try {
            const res = await fetch(`${apiUrl}/api/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment, uid: user.id, pid }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert("Adding comment failed: " + (data.msg || "Unknown error"));
                return;
            }

            setComments((prev) => [...prev, data.newComment]);
            setNewComment("");
        } catch (err) {
            console.error("fetch error", err);
        }
    };

    // Start edit mode
    const startEdit = (comment: CommentType) => {
        setEditingId(comment._id);
        setEditingText(comment.content);
    };

    // Save edited comment
    const editComment = async (id: string) => {
        try {
            const res = await fetch(`${apiUrl}/api/comment/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editingText }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert("Editing failed: " + (data.msg || "Unknown error"));
                return;
            }

            // Update comment in place
            setComments((prev) =>
                prev.map((c) => (c._id === id ? data.updatedComment : c))
            );

            setEditingId(null);
            setEditingText("");
        } catch (err) {
            console.error("fetch PATCH error", err);
        }
    };

    // Delete with confirmation
    const deleteComment = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return; // Stop if user cancels

        try {
            const res = await fetch(`${apiUrl}/api/comment/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (!res.ok) {
                alert("Deleting failed: " + (data.msg || "Unknown error"));
                return;
            }

            setComments((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error("fetch DELETE error", err);
        }
    };


    return (
        <div>
            <h3 className="font-bold">Comments</h3>

            <div>
                {comments.map((comment) => (
                    <div key={comment._id} className=" p-1 flex justify-between items-center">
                        <div>
                            <div>
                                <b>{comment.user ? comment.user.username : "Unknown User"}: </b>

                                {editingId === comment._id
                                    ? (
                                        <input className="border p-1" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                                    ) : (
                                        <span>{comment.content}</span>
                                    )}
                            </div>
                            <p className="text-blue-600 text-sm">posted on {new Date(comment.createdAt).toDateString()}</p>
                        </div>
                        {
                            user && user.id === comment.uid && (
                                <div className="flex gap-2 justify-center items-center">
                                    {editingId === comment._id
                                        ? (
                                            <>
                                                <button onClick={() => editComment(comment._id)} className="w-[6em] bg-blue-400 p-2 cursor-pointer rounded-3xl">Save</button>
                                                <button onClick={() => setEditingId(null)} className=" w-[6em] bg-gray-300 p-2 cursor-pointer rounded-3xl">Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEdit(comment)} className="w-[5em] bg-blue-300 p-2 cursor-pointer rounded-3xl">Edit</button>
                                        )}

                                    <button onClick={() => deleteComment(comment._id)} className=" w-[6em] bg-blue-400 p-2 cursor-pointer rounded-3xl">Delete</button>
                                </div> 
                            )
                        }
                    </div>
                ))}
            </div>

            <form onSubmit={commentHandler} className="flex justify-between items-center gap-4 mt-3">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg flex-1"
                    rows={1}
                    placeholder="Add a comment..."
                />
                <button className="bg-blue-600 w-[10em] text-white px-4 py-2 m-auto rounded-4xl cursor-pointer">Add</button>
            </form>
        </div>
    );
}
