import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "./../pages/Chat";

export const Router = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <BrowserRouter
      basename={isProduction ? "/google-dialogflow-cx-chatbot" : "/"}
    >
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/:name" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};
