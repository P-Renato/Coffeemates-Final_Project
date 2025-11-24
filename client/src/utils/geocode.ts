
export interface Coordinates {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  [key: string]: any; // optional other properties
}

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const res = await fetch(
      `http://localhost:4343/api/geocode?address=${encodeURIComponent(address)}`
    );

    if (!res.ok) {
      console.error("Failed to fetch geocode:", res.statusText);
      return null;
    }

    const data: NominatimResult[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

