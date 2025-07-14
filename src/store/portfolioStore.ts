import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Asset {
  simbolo: string;
  precio_actual: number;
  ultimo_update: Date;
  variacion_diaria: number;
  variacion_porcentual: number;
}

interface PortfolioState {
  assets: Record<string, Asset>;
  isLoading: boolean;
  error: string | null;
}

interface PortfolioActions {
  updateAssetPrice: (simbolo: string, precio: number) => void;
  updateAssetPrices: (assets: Asset[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getAsset: (simbolo: string) => Asset | undefined;
  getAllAssets: () => Asset[];
  clearAssets: () => void;
}

type PortfolioStore = PortfolioState & PortfolioActions;

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set, get) => ({
      // State
      assets: {},
      isLoading: false,
      error: null,

      // Actions
      updateAssetPrice: (simbolo: string, precio: number) => {
        set((state) => {
          const currentAsset = state.assets[simbolo];
          const precioAnterior = currentAsset?.precio_actual || precio;
          const variacion = precio - precioAnterior;
          const variacionPorcentual = precioAnterior > 0 ? (variacion / precioAnterior) * 100 : 0;

          return {
            assets: {
              ...state.assets,
              [simbolo]: {
                simbolo,
                precio_actual: precio,
                ultimo_update: new Date(),
                variacion_diaria: variacion,
                variacion_porcentual: variacionPorcentual,
              },
            },
          };
        }, false, 'updateAssetPrice');
      },

      updateAssetPrices: (assets: Asset[]) => {
        set((state) => {
          const newAssets = { ...state.assets };
          
          assets.forEach((asset) => {
            newAssets[asset.simbolo] = {
              ...asset,
              ultimo_update: new Date(),
            };
          });

          return {
            assets: newAssets,
          };
        }, false, 'updateAssetPrices');
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading }, false, 'setLoading');
      },

      setError: (error: string | null) => {
        set({ error }, false, 'setError');
      },

      getAsset: (simbolo: string) => {
        return get().assets[simbolo];
      },

      getAllAssets: () => {
        return Object.values(get().assets);
      },

      clearAssets: () => {
        set({ assets: {} }, false, 'clearAssets');
      },
    }),
    {
      name: 'portfolio-store',
    }
  )
);

// Selectors for better performance
export const useAssets = () => usePortfolioStore((state) => state.assets);
export const useAsset = (simbolo: string) => usePortfolioStore((state) => state.getAsset(simbolo));
export const useAssetsLoading = () => usePortfolioStore((state) => state.isLoading);
export const useAssetsError = () => usePortfolioStore((state) => state.error);