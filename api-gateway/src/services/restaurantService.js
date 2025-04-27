const { createProxyMiddleware } = require("http-proxy-middleware");

const restaurantServiceProxy = createProxyMiddleware({
  target: process.env.RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  secure: false,
  timeout: 10000,
  proxyTimeout: 10000,
  pathRewrite: {
    // Handle menu item operations
    "^/api/v1/restaurants/([0-9a-fA-F]{24})/menu/([0-9a-fA-F]{24})$":
      "/api/v1/restaurants/$1/menu/$2",
    "^/api/v1/restaurants/([0-9a-fA-F]{24})/menu$":
      "/api/v1/restaurants/$1/menu",
    // Handle restaurant-specific operations (get, update, delete)
    "^/api/v1/restaurants/([0-9a-fA-F]{24})$": "/api/v1/restaurants/$1",
    // Handle get all restaurants
    "^/api/v1/restaurants/+$": "/api/v1/restaurants",
    // Handle other restaurant routes
    "^/api/v1/restaurants": "/api/v1/restaurants",
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log("Proxying request to restaurant service:", {
      method: req.method,
      path: req.path,
      target: process.env.RESTAURANT_SERVICE_URL,
      headers: req.headers,
      user: req.user,
      body: req.body,
    });

    // Set user headers if available
    if (req.user && req.user.id) {
      proxyReq.setHeader("X-User-Id", req.user.id);
      if (req.user.role) {
        proxyReq.setHeader("X-User-Role", req.user.role);
      }
    }

    // Set Authorization header if present
    if (req.headers.authorization) {
      proxyReq.setHeader("Authorization", req.headers.authorization);
    }

    // Ensure content-length is set correctly
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log("Received response from restaurant service:", {
      statusCode: proxyRes.statusCode,
      headers: proxyRes.headers,
      path: req.path,
      method: req.method,
    });
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).json({
      success: false,
      error: "Error connecting to restaurant service",
      details: err.message,
    });
  },
});

module.exports = restaurantServiceProxy;
