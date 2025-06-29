
// Legacy hook for backward compatibility - now uses the new modular hooks
import { useFetchOperations } from './useFetchOperations';
import { useMutateOperation } from './useMutateOperation';

export const useOperations = (portfolioId?: string) => {
  const fetchHook = useFetchOperations(portfolioId);
  const mutateHook = useMutateOperation();

  return {
    ...fetchHook,
    ...mutateHook,
  };
};
