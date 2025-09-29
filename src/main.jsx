import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Function untuk apply dark mode
function applyDarkMode() {
  const darkMode = localStorage.getItem('darkMode');
  
  if (darkMode === 'true') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Apply segera
applyDarkMode();

// Watch untuk perubahan dan re-apply jika dihapus
const observer = new MutationObserver(() => {
  const darkMode = localStorage.getItem('darkMode');
  const hasDark = document.documentElement.classList.contains('dark');
  
  if (darkMode === 'true' && !hasDark) {
    console.log('Dark class was removed! Re-adding...');
    document.documentElement.classList.add('dark');
  }
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)