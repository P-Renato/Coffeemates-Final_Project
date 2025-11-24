import type { Request, Response } from "express"
import { Location } from "../models/Location";

export const getlocation = async(req: Request, res: Response) => {
    try {
        const locations = await Location.find();
        res.status(200).json({ success: true, locations });
      } catch (err) {
        res.status(500).json({ success: false, msg: "Error fetching location in location" });
      }
}