import type { PostType } from "../../utils/types";
import { star } from "../../utils/rating";

export default function MapWithSidePanel({ content }: { content: PostType }) {
  const rating = star(content.star);

  return (
    <div className="bg-white w-full h-full p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-2">{content.shopName}</h2>
      <p className="text-yellow-600 mb-2">{content.star} {rating}  <span>({content.commentIds.length})</span></p>
      <p className="flex justify-between">⏱️ Open: 11am - 12pm</p>
      <p className="mb-2">📍 {content.location}</p>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl cursor-pointer">Directions</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl cursor-pointer">Save</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl cursor-pointer">Share</button>
      </div>
    </div>
  );
}
