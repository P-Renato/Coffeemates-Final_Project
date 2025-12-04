import type { Request, Response } from "express";

// Geocoding: get lat, long from address
export const getGeoCode = async (req: Request, res:Response) => {
    const address = req.query.address; 

    if (!address) return res.status(400).send({ error: "Missing address" });

    // Type guard - ensure it's a string
    if (typeof address !== 'string' || !address.trim()) {
        return res.status(400).send({ error: "Missing or invalid address" });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Coffeemates/1.0 (dcistudentcoffemates@gmail.com)",
            },
        });

        if (!response.ok) {
            console.error("Nominatim error:", response.statusText);
            return res.status(500).send({ error: "Failed to fetch from Nominatim" });
        }

        const data = await response.json();
        res.send(data);
    } catch (err) {
        console.error("Geocode route error:", err);
        res.status(500).send({ error: "Failed to fetch from Nominatim" });
    }
}

// Reverse geocoding: get address from lat, long
export const getReverseGeoCode = async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).send({ error: "Missing lat or lon" });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Coffeemates/1.0 (dcistudentcoffemates@gmail.com)",
      },
    });

    if (!response.ok) {
      console.error("Nominatim reverse error:", response.statusText);
      return res.status(500).send({ error: "Failed to fetch from Nominatim" });
    }

    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.error("Reverse Geocode route error:", err);
    res.status(500).send({ error: "Failed to fetch from Nominatim" });
  }
};