import { useState, useEffect } from "react"
import type { CommentType } from "../../utils/types";


export default function CommentList({ pid }: { pid: string }) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState("");

    // loading all comments
    useEffect(() => {
        fetch(`http://localhost:4343/api/comment/post/${pid}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("API DATA:", data);

                if (data.success && Array.isArray(data.comments)) {
                    setComments(data.comments);
                }
            })
            .catch((err) => console.log("Fetching comment error ", err));
    }, [pid]);

    // send a new comment
    const commentHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:4343/api/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment, uid: 2, pid, parentCommentId: "" }),
            })
            if (!res.ok) {
                const error = await res.json();
                alert("Adding comment failed: " + (error.msg || "Unknown error"));
                return;
            }

            const data = await res.json();
            setNewComment("");
            setComments((prev) => [...prev,data.newComment]);
        } catch (err) {
            console.error("fetch error", err);
            alert("Something went wrong. Please try again.");
        }

    }
    return (
        <div>
            <h3 className="font-bold">Comments</h3>
            <div className="bg-green-200">
                {
                    comments.map((comment) => (
                        <p>{comment.uid} : {comment.content}</p>
                    ))
                }
            </div>
            <form onSubmit={commentHandler} className="flex justify-between items-center" action="">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="border" cols={25} rows={5} placeholder="Add a comment..." />
                <button className="bg-blue-600 text-white px-4 py-2 rounded h-[3em] cursor-pointer">Add</button>
            </form>
        </div>
    )
}
