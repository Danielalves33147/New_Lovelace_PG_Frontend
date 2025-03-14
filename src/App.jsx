import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import FormActivity from "./pages/FormActivity.jsx";
import Activity from "./pages/Activity.jsx";
import UserArea from "./pages/UserArea.jsx";
import Profile from "./pages/Profile.jsx";
import EditActivity from "./pages/EditActivity.jsx";
import AccessActivity from "./pages/AccessActivity.jsx";
import ActivityResponses from "./pages/ActivityResponses.jsx";
import Practice from "./pages/pratica.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";


import React, { createContext, useContext, useState, useEffect } from 'react';

import { UserProvider } from '../services/UserContext.jsx';  // Importa o UserProvider pro Context

import { ToastContainer } from 'react-toastify';

import { Toaster, toast } from 'sonner'

import 'react-toastify/dist/ReactToastify.css';
export default function App() {

  useEffect(() => {
    console.log("🔍 Testando conexão com o backend...");

    fetch(`${import.meta.env.VITE_API_URL}/test`)
      .then(resp => resp.text())
      .then(data => console.log("✅ Backend responde:", data))
      .catch(err => console.error("❌ Erro na comunicação com o backend:", err));
  }, []);

  return (
    <UserProvider>
      <ToastContainer />
      <Toaster expand={false} richColors position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ce" element={<FormActivity />} />
          <Route path="/prt" element={<Practice />} />
          <Route path="/a/:id" element={<Activity />} />
          <Route path="/ua" element={<UserArea />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/eA/:id" element={<EditActivity />} />
          <Route path="/aA/:id" element={<AccessActivity />} />
          <Route path="/rA/:id" element={<ActivityResponses />} />
        </Routes>
      </BrowserRouter >
    </UserProvider>
  );
}
