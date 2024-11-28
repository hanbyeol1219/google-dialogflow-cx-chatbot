import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://google-dialogflow-cx-chatbot.vercel.app"
      : "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
