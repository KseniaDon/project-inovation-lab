import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

localStorage.setItem("theme", "dark");
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);