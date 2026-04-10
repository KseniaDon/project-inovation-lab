import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "dark");
}
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);