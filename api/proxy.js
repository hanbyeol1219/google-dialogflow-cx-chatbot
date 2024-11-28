import { createProxyMiddleware } from "http-proxy-middleware";

export default async function handler(req, res) {
  // HTTP Proxy 설정
  const proxy = createProxyMiddleware({
    target: process.env.PROXY_TARGET_URL || "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  });

  // Proxy 요청 처리
  return new Promise((resolve, reject) => {
    proxy(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
