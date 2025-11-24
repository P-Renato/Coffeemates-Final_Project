// MapDisplay.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export default function Map() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
  fetch("http://localhost:4343/api/location")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && Array.isArray(data.locations)) {
        setLocations(data.locations);
      } else {
        setLocations([]);
      }
    })
    .catch(() => setLocations([]));
}, []);


  return (
    <MapContainer center={[52.52, 13.405]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
