import express from "express"
import { getlocation } from "../controllers/locationController";

const location = express.Router();

location.get("/", getlocation);

export default location
