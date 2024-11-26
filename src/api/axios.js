import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
  baseURL: process.env.DEPLOY_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
