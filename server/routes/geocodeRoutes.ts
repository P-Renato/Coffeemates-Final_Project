import express from 'express'
import { getGeoCode, getReverseGeoCode } from '../controllers/geocodeController';

const geocode = express.Router();

geocode.get("/", getGeoCode);
geocode.get("/reverse", getReverseGeoCode);

export default geocode