import { PriceService } from './services/priceService';
console.log('🏁 Starting app, initializing PriceService…');
PriceService.initialize();

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
console.log('🏁 App rendered');
