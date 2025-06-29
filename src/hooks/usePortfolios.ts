
// Legacy hook for backward compatibility - now uses the new modular hooks
import { useFetchPortfolios } from './useFetchPortfolios';
import { useMutatePortfolio } from './useMutatePortfolio';

export const usePortfolios = () => {
  const fetchHook = useFetchPortfolios();
  const mutateHook = useMutatePortfolio();

  return {
    ...fetchHook,
    ...mutateHook,
  };
};
