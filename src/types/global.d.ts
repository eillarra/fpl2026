// Central re-export of all evan-kit types for FPL 2026
// This allows importing types from '@/types' instead of 'evan-kit/types' or '@evan/types'

// Re-export all evan-kit types
export * from '@evan/types';

// fpl-specific type extensions can be added here
// For example:
// export interface FplEvent extends EvanEvent {
//   readonly fpl_specific_field?: string;
// }
