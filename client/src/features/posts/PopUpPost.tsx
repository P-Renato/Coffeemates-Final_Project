import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import LocationPicker from "../map/LocationPicker";
import { geocodeAddress } from "../../utils/geocode.ts";

export default function PopUpPost() {
    const { setPostPopup } = useAppContext();
    const { setLocationList } = useAppContext();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [shopName, setShopName] = useState("");
    const [star, setStar] = useState("");

    // location
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [imageFile]);

    const postHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return alert("Please select an image.");
        if (!location) return alert("Please pick a location.");

        let finalLat = lat;
        let finalLng = lng;

        if (location && (lat === null || lng === null)) {
            const coordinates = await geocodeAddress(location);
            if (!coordinates) {
                return alert("Could not find coordinates for this address.");
            }
            finalLat = coordinates.lat;
            finalLng = coordinates.lng;
            setLat(finalLat);
            setLng(finalLng);
        }

        if (finalLat === null || finalLng === null) {
            return alert("Invalid coordinates. Please pick a location again.");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("shopName", shopName);
        formData.append("star", star);
        formData.append("postImg", imageFile);
        formData.append("location", location);
        formData.append("lat", finalLat.toString());
        formData.append("lng", finalLng.toString());

        try {
            const res = await fetch("http://localhost:4343/api/post", {
                method: "POST",
                body: formData,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                return alert("Adding post failed: " + (error.msg || "Unknown error"));
            }

            // data.newPost = [newPostContent, newLocation]
            const [newPostContent, newLocation] = data.newPost;

            alert("Post created successfully!");
            setLocationList(prev => [...prev, newLocation]);
            setPostPopup(false);
            setTitle("");
            setContent("");
            setShopName("");
            setStar("");
            setLocation("");
            setLat(null);
            setLng(null);
            setImageFile(null);

        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };


    const handleCancel = () => {
        setPostPopup(false);
        setTitle("");
        setContent("");
        setShopName("");
        setStar("");
        setLocation("");
        setLat(null);
        setLng(null);
        setImageFile(null);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-500 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full sm:w-[800px] relative">
                <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
                    Create New Post
                </h2>

                <div className="flex flex-col sm:flex-row gap-8">
                    {/* Image Upload */}
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

                    {/* Form */}
                    <form onSubmit={postHandler} className="flex flex-col gap-4 flex-1">
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

                        {/* Location */}
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
                            onChange={(e) => setStar(e.target.value)}
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
                            Post
                        </button>
                    </form>
                </div>

                {/* Close */}
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
