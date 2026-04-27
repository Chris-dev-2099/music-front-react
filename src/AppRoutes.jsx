import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// My Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import SongsPage from "./pages/SongsPage";

export default function AppRoutes() {

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/songs"
        element={
          isAuthenticated ? <SongsPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/users"
        element={
          isAuthenticated ? <UsersPage /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}