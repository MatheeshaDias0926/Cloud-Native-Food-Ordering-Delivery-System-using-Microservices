const { createProxyMiddleware } = require("http-proxy-middleware");

const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  secure: false,
  timeout: 10000,
  proxyTimeout: 10000,
  pathRewrite: {
    // Handle user-specific operations (get, update, delete)
    "^/api/v1/auth/([0-9a-fA-F]{24})$": "/api/v1/auth/users/$1",
    // Handle get all users
    "^/api/v1/auth/+$": "/api/v1/auth/users",
    // Handle other auth routes
    "^/api/v1/auth": "/api/v1/auth",
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log("Proxying request to user service:", {
      method: req.method,
      path: req.path,
      target: process.env.USER_SERVICE_URL,
      headers: req.headers,
      body: req.body,
    });

    // Add user info to headers if available
    if (req.user) {
      proxyReq.setHeader("X-User-Id", req.user.id);
      proxyReq.setHeader("X-User-Role", req.user.role);
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

    // Ensure the request method is preserved
    proxyReq.method = req.method;
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log("Received response from user service:", {
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
      error: "Error connecting to user service",
      details: err.message,
    });
  },
});

module.exports = userServiceProxy;
