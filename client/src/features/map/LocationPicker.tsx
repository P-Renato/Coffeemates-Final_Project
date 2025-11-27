import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

type Coordinates = { lat: number; lng: number };

type LocationPickerProps = {
  location: string;
  setLocation: (loc: string) => void;
  setLatLng: (lat: number, lng: number) => void;
  close: () => void;
};

function ClickMarker({ setLocation, setLatLng }: { setLocation: (loc: string) => void; setLatLng: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<Coordinates | null>(null);

  useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(coords);
      setLatLng(coords.lat, coords.lng);
      setLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`); // store string for display
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function LocationPicker({ location, setLocation, setLatLng, close }: LocationPickerProps) {
  const [manual, setManual] = useState(location);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManual(value);
    setLocation(value); 
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl relative">
        <h3 className="text-lg font-bold text-center mb-4">Pick Location</h3>

        {/* Map */}
        <div className="h-64 w-full mb-4 rounded-lg overflow-hidden">
          <MapContainer center={[52.52, 13.405]} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickMarker setLocation={setLocation} setLatLng={setLatLng} />
          </MapContainer>
        </div>

        {/* Manual input */}
        <input
          type="text"
          placeholder="Or type location manually"
          value={manual}
          onChange={handleManualChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <button
          onClick={close}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
        >
          Confirm Location
        </button>

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
