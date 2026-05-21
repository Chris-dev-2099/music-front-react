import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 3500,
        style: {
          background: "rgba(17, 24, 39, 0.95)",
          color: "#e5e7eb",
          border: "1px solid rgba(34, 211, 238, 0.18)",
          borderRadius: "18px",
          padding: "14px 16px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 25px rgba(34, 211, 238, 0.12)",
          fontSize: "14px",
        },

        success: {
          iconTheme: {
            primary: "#22d3ee",
            secondary: "#0f172a",
          },
          style: {
            border: "1px solid rgba(34, 211, 238, 0.25)",
            boxShadow: "0 0 30px rgba(34, 211, 238, 0.18)",
          },
        },

        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f172a",
          },
          style: {
            border: "1px solid rgba(239, 68, 68, 0.25)",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.15)",
          },
        },
      }}
    />
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
