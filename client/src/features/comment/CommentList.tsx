import { useState, useEffect } from "react"
import type { CommentType } from "../../utils/types";

export default function CommentList({ pid }: { pid: string }) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState("");

    // Editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    // Load all comments
    useEffect(() => {
        fetch(`http://localhost:4343/api/comment/post/${pid}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.comments)) {
                    setComments(data.comments);
                }
            })
            .catch((err) => console.log("Fetching comment error ", err));
    }, [pid]);

    // Add a comment
    const commentHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:4343/api/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment, uid: 2, pid }),
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
            const res = await fetch(`http://localhost:4343/api/comment/${id}`, {
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

    // Delete
    const deleteComment = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:4343/api/comment/${id}`, {
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
                    <div key={comment._id} className="bg-green-200 p-2 m-2 flex justify-between items-center">
                        <div>
                            <div>
                                <b>{comment.uid}: </b>

                                {editingId === comment._id
                                    ? (
                                        <input className="border p-1" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                                    ) : (
                                        <span>{comment.content}</span>
                                    )}
                            </div>
                            <p className="text-blue-600 text-sm">posted on {new Date(comment.createdAt).toDateString()}</p>
                        </div>

                        <div className="flex gap-2">
                            {editingId === comment._id
                                ? (
                                    <>
                                        <button onClick={() => editComment(comment._id)} className="bg-blue-400 p-2 cursor-pointer">Save</button>
                                        <button onClick={() => setEditingId(null)} className="bg-gray-300 p-2 cursor-pointer">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => startEdit(comment)} className="bg-yellow-400 p-2 cursor-pointer">Edit</button>
                                )}

                            <button onClick={() => deleteComment(comment._id)} className="bg-red-300 p-2 cursor-pointer">Delete</button>
                        </div>

                    </div>
                ))}
            </div>

            <form onSubmit={commentHandler} className="flex flex-col gap-2 mt-3">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border p-2"
                    rows={4}
                    placeholder="Add a comment..."
                />
                <button className="bg-blue-600 w-[10em] text-white px-4 py-2 m-auto rounded cursor-pointer">Add</button>
            </form>
        </div>
    );
}
