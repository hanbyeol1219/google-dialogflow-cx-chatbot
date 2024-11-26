import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "./../pages/Chat";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/:name" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};
