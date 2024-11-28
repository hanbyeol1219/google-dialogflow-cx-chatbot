import express, { json } from "express";
import { SessionsClient } from "@google-cloud/dialogflow-cx";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const deployURL = process.env.DEPLOY_URL;
const localURL = process.env.LOCAL_URL;
const serverURL = process.env.SERVER_URL;

console.log("deployURL:", deployURL);
console.log("localURL:", localURL);
console.log("serverURL:", serverURL);

if (!keyPath) {
  process.exit(1);
}

app.use(
  cors({
    origin: [deployURL, localURL, serverURL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(json());
app.use(express.json());

const projectId = process.env.VITE_PROJECT_ID;
const agentId = process.env.VITE_AGENT_ID;
const channel = process.env.VITE_CHANNEL;

if (!projectId || !agentId || !channel) {
  process.exit(1);
}

const client = new SessionsClient({ keyFilename: keyPath });

app.post("/sendMessage", async (req, res) => {
  const { sessionId, userMessage, event } = req.body;
  console.log("Received request for /sendMessage:", req.body);
  console.log("userMessage:", userMessage);
  console.log("event:", event);
  console.log("★");
  console.log("projectId:", projectId);
  console.log("agentId:", agentId);
  console.log("sessionId:", sessionId);

  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    "global",
    agentId,
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
    channel: channel,
  };

  console.log("request:", request);

  try {
    const [response] = await client.detectIntent(request);
    const fulfillmentMessages = response.queryResult.responseMessages;
    res.json(fulfillmentMessages);
  } catch (error) {
    console.error("API 호출 오류:", error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
