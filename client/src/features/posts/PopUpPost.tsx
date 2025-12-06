import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/LocationPostContext";
import LocationPicker from "../map/LocationPicker";
import { geocodeAddress, reverseGeocode } from "../../utils/geocode";
import { useAuth } from "../../hooks/useAuth";
import { createPost, updatePost } from "../../api/postApi";
import type { PostType } from "../../utils/types";

interface PopUpPostProps {
    postToEdit?: PostType; 
    onSuccess?: (post: PostType, isEdit: boolean) => void;
    onCancel?: () => void;
}

export default function PopUpPost({ postToEdit }: PopUpPostProps) {
    const { user } = useAuth();
    const { setPostPopup, setLocationList, posts, setPosts, editingPost, setEditingPost } = useAppContext();

    // Form states
    const [title, setTitle] = useState(postToEdit?.title || "");
    const [content, setContent] = useState(postToEdit?.content || "");
    const [shopName, setShopName] = useState(postToEdit?.shopName || "");
    const [star, setStar] = useState<number | "">(postToEdit?.star || "");

    // Location
    const [location, setLocation] = useState(postToEdit?.location || "");
    const [lat, setLat] = useState<number | null>(postToEdit?.lat || null);
    const [lng, setLng] = useState<number | null>(postToEdit?.lng || null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // Image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(postToEdit?.postImg || null);

    // Preview image
    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setShopName("");
        setStar("");
        setLocation("");
        setLat(null);
        setLng(null);
        setImageFile(null);
        setPreviewUrl(null);
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) return alert("Please log in to create a post.");
        if (!location && (lat === null || lng === null)) return alert("Please pick a location.");
        if (!postToEdit && !imageFile) return alert("Please select an image."); // image required only for new post

        let finalLat = lat;
        let finalLng = lng;

        // Geocode if lat/lng missing
        if ((lat === null || lng === null) && location) {
            const coordinates = await geocodeAddress(location);
            if (!coordinates) return alert("Could not find coordinates for this address.");
            finalLat = coordinates.lat;
            finalLng = coordinates.lng;
            setLat(finalLat);
            setLng(finalLng);
        }

        // Reverse geocode if location missing
        if ((lat !== null && lng !== null) && !location) {
            const name = await reverseGeocode(lat, lng);
            if (name) setLocation(name);
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("shopName", shopName);
        formData.append("star", star.toString());
        formData.append("uid", user.id); // MongoDB ObjectId
        formData.append("location", location);
        formData.append("lat", finalLat.toString());
        formData.append("lng", finalLng.toString());
        if (imageFile) formData.append("postImg", imageFile);

        console.log("before update data: ", title);

        try {
            let data;
            if (postToEdit) {
                // Edit mode
                data = await updatePost(postToEdit._id, formData);
                alert("Post updated successfully!");
                setPosts(posts.map(p => (p._id === postToEdit._id ? data.updatedPost : p)));
                setEditingPost(null);
            } else {
                // Add mode
                data = await createPost(formData);
                alert("Post created successfully!");
                setPosts(prev => [...prev, data.newPost]);
                setLocationList(prev => [...prev, data.newLocation]);

            }

            setPostPopup(false);
            resetForm();
        } catch (error) {
            console.error("Post error:", error);
            alert(`Failed to submit post: ${(error as Error).message || "Please try again."}`);
        }
    };

    const handleCancel = () => {
        setPostPopup(false);
        resetForm();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-500 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full sm:w-[800px] relative">
                <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
                    {postToEdit ? "Edit Post" : "Create New Post"}
                </h2>

                <div className="flex flex-col sm:flex-row gap-8">
                    <label className="cursor-pointer w-full sm:w-72 h-72 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors duration-200 relative overflow-hidden">
                        {!previewUrl && <span className="text-center px-2">Click to upload or drag image</span>}
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                            }}
                        />
                    </label>

                    <form onSubmit={submitHandler} className="flex flex-col gap-4 flex-1">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Title"
                            required
                        />
                        <input
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Name of shop"
                            required
                        />

                        <input
                            value={location}
                            onClick={() => setShowLocationPicker(true)}
                            readOnly
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 cursor-pointer"
                            placeholder="Location"
                            required
                        />
                        {showLocationPicker && (
                            <LocationPicker
                                location={location}
                                setLocation={setLocation}
                                setLatLng={(newLat, newLng) => {
                                    setLat(newLat);
                                    setLng(newLng);
                                }}
                                close={() => setShowLocationPicker(false)}
                            />
                        )}

                        <input
                            value={star}
                            onChange={(e) => setStar(Number(e.target.value))}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            type="number"
                            placeholder="Rating (1-5)"
                            min={1}
                            max={5}
                            required
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            rows={6}
                            placeholder="Write your review here..."
                            required
                        />

                        <button
                            type="submit"
                            className="w-full sm:w-[10em] m-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                            {postToEdit ? "Update" : "Post"}
                        </button>
                    </form>
                </div>

                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
