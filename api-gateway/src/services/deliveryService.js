const { createProxyMiddleware } = require("http-proxy-middleware");

const deliveryServiceProxy = createProxyMiddleware({
  target: process.env.DELIVERY_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    if (req.user) {
      proxyReq.setHeader("X-User-Id", req.user.id);
      proxyReq.setHeader("X-User-Role", req.user.role);
    }
  },
});

module.exports = deliveryServiceProxy;
