// import { createProxyMiddleware } from "http-proxy-middleware";

// export default async function handler(req, res) {
//   // HTTP Proxy 설정
//   const proxy = createProxyMiddleware({
//     target: process.env.PROXY_TARGET_URL || "http://localhost:5000",
//     changeOrigin: true,
//     pathRewrite: {
//       "^/sendMessage": "",
//     },
//   });

//   // Proxy 요청 처리
//   return new Promise((resolve, reject) => {
//     proxy(req, res, (err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });
// }

import { SessionsClient } from "@google-cloud/dialogflow-cx";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { sessionId, userMessage, event } = req.body;

  const client = new SessionsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const sessionPath = client.projectLocationAgentSessionPath(
    process.env.VITE_PROJECT_ID,
    "global",
    process.env.VITE_AGENT_ID,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: userMessage ? { text: userMessage } : undefined,
      event: event
        ? {
            event,
            parameters: {},
          }
        : undefined,
      languageCode: "ko",
    },
    channel: process.env.VITE_CHANNEL,
  };

  try {
    const [response] = await client.detectIntent(request);
    const fulfillmentMessages = response.queryResult.responseMessages;
    res.status(200).json(fulfillmentMessages);
  } catch (error) {
    console.error("API 호출 오류:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
