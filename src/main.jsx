import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { seedIfEmpty } from './utils/seedData';
import './styles/index.css';

seedIfEmpty(); // first visit only: fills local storage with demo data

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
