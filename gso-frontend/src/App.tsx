import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FrontPage from "./pages";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// <Route path="/post/:postId" element={<PostPage />} />
