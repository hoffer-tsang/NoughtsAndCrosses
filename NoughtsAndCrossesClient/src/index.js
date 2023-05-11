import React, { StrictMode  } from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider'
import Router from './Router'

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path = "/*" element={<Router />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
