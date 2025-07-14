# Portfolio Feature

This feature contains all portfolio-related functionality including real-time price tracking, asset management, and portfolio visualization.

## Components

### LivePortfolio
Real-time portfolio component that displays live asset prices with:
- WebSocket subscription to price updates
- Real-time price variations and percentages
- Connection status indicators
- Start/stop controls for live feed

## Hooks

### useLivePrices
Custom hook for managing live price subscriptions:
- Automatic subscription management
- Error handling
- Loading states
- Connection status tracking

## Types

### PortfolioAsset
Interface defining asset structure with real-time data:
- Current price and variations
- Update timestamps
- Portfolio-specific data (quantity, total value)

## Usage

```tsx
import { LivePortfolio } from '@/features/portfolio/components/LivePortfolio';
import { useLivePrices } from '@/features/portfolio/hooks/useLivePrices';

// Basic usage
<LivePortfolio symbols={['AAPL', 'GOOGL', 'MSFT']} />

// With hook
const { assets, isSubscribed, startLivePrices } = useLivePrices({
  symbols: ['AAPL', 'GOOGL'],
  autoStart: true
});
```