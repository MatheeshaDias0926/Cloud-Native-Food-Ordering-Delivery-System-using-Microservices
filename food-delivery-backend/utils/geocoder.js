const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  apiKey: process.env.GEOCODER_API_KEY,
  userAgent: "FoodDeliveryApp", // Required for Nominatim usage policy
  email: "matheeshadias@gmail.com",
  limit: 1,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
// This module exports a geocoder instance configured with the provider and API key from environment variables.
// It uses the 'node-geocoder' package to perform geocoding operations.
// The 'httpAdapter' is set to 'https' for secure requests.
// The 'formatter' option is set to null, meaning the default response format will be used.
// The 'geocoder' instance can be used to convert addresses into geographic coordinates (latitude and longitude) and vice versa.
