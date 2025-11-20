import { useFavorites as useEvanFavorites } from '@evan/composables/useFavorites';

// fpl-specific wrapper for favorites with custom storage key
export function useFavorites() {
  return useEvanFavorites('fpl2026_favorites', 1);
}
