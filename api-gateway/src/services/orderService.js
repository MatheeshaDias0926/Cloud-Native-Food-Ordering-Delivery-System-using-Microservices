const { createProxyMiddleware } = require("http-proxy-middleware");

const orderServiceProxy = createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    if (req.user) {
      proxyReq.setHeader("X-User-Id", req.user.id);
      proxyReq.setHeader("X-User-Role", req.user.role);
    }
  },
});

module.exports = orderServiceProxy;
