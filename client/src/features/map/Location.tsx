import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState } from "react";
import {  geocodeAddress } from "../geocode";
import type { Coordinates } from "../geocode";


interface MyMapProps {}

function MapView({ center }: { center: Coordinates }) {
  const map = useMap();
  map.setView([center.lat, center.lng], map.getZoom());
  return null;
}

export default function Location() {
  const [markers, setMarkers] = useState<Coordinates[]>([]);
  const [center, setCenter] = useState<Coordinates>({ lat: 52.52, lng: 13.405 }); // Berlin default

  const handleAddressSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = (e.currentTarget.elements.namedItem("address") as HTMLInputElement).value;

    const result = await geocodeAddress(address);
    if (!result) return alert("Address not found");

    setMarkers((prev) => [...prev, result]);
    setCenter(result); // <-- update map center to new marker
  };

  return (
    <div>
      <form onSubmit={handleAddressSearch}>
        <input type="text" name="address" placeholder="Enter address" required />
        <button type="submit">Add Marker</button>
      </form>

      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((pos, idx) => (
          <Marker key={idx} position={[pos.lat, pos.lng]}>
            <Popup>
              Marker #{idx + 1} <br />
              Lat: {pos.lat}, Lng: {pos.lng}
            </Popup>
          </Marker>
        ))}

        {/* Pan map to latest marker */}
        <MapView center={center} />
      </MapContainer>
    </div>
  );
}
