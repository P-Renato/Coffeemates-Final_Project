import express from 'express'
import { getGeoCode } from '../controllers/geocodeController';

const geocode = express.Router();

// Routes
geocode.get("/", getGeoCode);

export default geocode