
export interface Coordinates {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  [key: string]: unknown; // optional other properties
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

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `http://localhost:4343/api/geocode/reverse?lat=${lat}&lon=${lng}`
    );

    if (!res.ok) {
      console.error("Failed to fetch reverse geocode:", res.statusText);
      return null;
    }

    const data = await res.json();
    if (!data || !data.display_name) return null;

    return data.display_name;
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    return null;
  }
}

