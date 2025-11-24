import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAppContext } from "../context/LocationPostContext";

export default function Map() {
  const {locationList} = useAppContext();

  return (
    <MapContainer center={[52.52, 13.405]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locationList.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
