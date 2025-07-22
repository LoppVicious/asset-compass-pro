import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PriceService } from './services/priceService'

// Initialize PriceService before rendering the app
PriceService.initialize();

createRoot(document.getElementById("root")!).render(<App />);
