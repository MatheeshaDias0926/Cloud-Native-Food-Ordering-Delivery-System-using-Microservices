const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY, // Required for Google Maps
  formatter: null, // Optional: 'gpx', 'string', etc.
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
