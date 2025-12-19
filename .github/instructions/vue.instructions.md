---
applyTo: '**/*.vue,**/*.ts'
description: Vue 3, Quasar, and Pinia coding standards for the project.
---

## Core architecture

- Framework: Vue 3.
- API: Composition API with `<script setup lang="ts">` is mandatory.
- Package manager: Use `yarn` for all package management commands (e.g., `yarn add`, `yarn remove`).
- State management: Pinia is the only state management library.

## Component structure

- File order: `<style scoped>`, then `<template>`, then `<script setup>`.
- Styles: the `<style>` tag **must always** be `scoped`.
- Naming:
  - Component files: `PascalCase.vue`
  - Composable functions: `useSomething.ts`

## Quasar Framework

- Components: always prefer Quasar components (`<q-btn>`, `<q-input>`, etc.) over native HTML elements.
- Styling: use Quasar's layout and utility classes (`q-pa-md`, `row`, `col`, `text-h1`) instead of writing custom CSS for layout and typography.

## Code organization for testability

### Pure functions vs composables

- **Pure functions** (in `src/utils/`): Stateless, no Vue reactivity. Easy to test.
- **Composables** (in `src/composables/`): Use Vue reactivity (`ref`, `computed`, `watch`). Test with `@vue/test-utils`.

### Extracting testable logic

When writing components, extract business logic into testable units:

```typescript
// ❌ Logic buried in component - hard to test
const items = computed(() =>
  rows.value.map((row) => ({
    label: showFull.value ? row.full_name : row.short_name,
    // ... more transformation
  }))
);

// ✅ Extract to pure function - easy to test
export function transformRows(rows: ApiRow[], showFull: boolean): Item[] {
  return rows.map((row) => ({ ... }));
}

// In component:
const items = computed(() => transformRows(rows.value, showFull.value));
```

## Testing (Vitest)

### General rules

- Test runner: Vitest with `happy-dom` environment.
- Run tests: `yarn test` (single run) or `yarn test:watch` (watch mode).
- All pure functions and composables should have tests.
- Structure tests using the Arrange-Act-Assert (AAA) pattern.

### File organization

Tests live in `__tests__` folders next to the code they test:

```
src/
  composables/
    shared/
      __tests__/
        useAsyncState.test.ts
        usePagination.test.ts
      useAsyncState.ts
      usePagination.ts
  utils/
    __tests__/
      formatting.test.ts
    formatting.ts
```

### Testing pure functions

Pure functions are the easiest to test - no mocking required:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, parseAmount } from '../formatting';

describe('formatCurrency', () => {
  it('formats number with currency symbol', () => {
    expect(formatCurrency(1234.5, 'EUR')).toBe('€1,234.50');
  });

  it('handles zero values', () => {
    expect(formatCurrency(0, 'EUR')).toBe('€0.00');
  });
});
```

### Testing composables

Composables that use Vue reactivity can be tested directly - no component mounting needed for most cases:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { usePagination } from '../usePagination';

// Mock vue-router if the composable uses it
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: {} })),
  useRouter: vi.fn(() => ({ replace: vi.fn() })),
}));

describe('usePagination', () => {
  it('calculates total pages correctly', () => {
    const totalItems = ref(95);
    const { totalPages } = usePagination({ totalItems, pageSize: 20 });
    expect(totalPages.value).toBe(5);
  });

  it('navigates to next page', () => {
    const totalItems = ref(100);
    const { page, nextPage } = usePagination({ totalItems });
    nextPage();
    expect(page.value).toBe(2);
  });
});
```

### Test naming conventions

| Pattern                | Purpose             | Example                 |
| ---------------------- | ------------------- | ----------------------- |
| `[function].test.ts`   | Pure function tests | `formatting.test.ts`    |
| `[composable].test.ts` | Composable tests    | `usePagination.test.ts` |
| `[Component].test.ts`  | Component tests     | `UserCard.test.ts`      |

### What to test

| Type           | Test focus                                               |
| -------------- | -------------------------------------------------------- |
| Pure functions | Input/output transformations, edge cases                 |
| Composables    | Reactive state changes, computed values, method behavior |
| Components     | User interactions, rendered output (use sparingly)       |
