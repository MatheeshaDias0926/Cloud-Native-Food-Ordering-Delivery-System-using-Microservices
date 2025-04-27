const { createProxyMiddleware } = require("http-proxy-middleware");

const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  secure: false,
  timeout: 10000,
  proxyTimeout: 10000,
  pathRewrite: { "^/api/v1/auth": "/api/v1/auth" },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log("Proxying request to user service:", {
      method: req.method,
      path: req.path,
      target: process.env.USER_SERVICE_URL,
      headers: req.headers,
    });

    // Ensure content-length is set correctly
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log("Received response from user service:", {
      statusCode: proxyRes.statusCode,
      headers: proxyRes.headers,
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
