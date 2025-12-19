# FPL 2026 Conference PWA - Copilot Instructions

## Project Overview

This is a Vue 3 + Quasar PWA for the FPL 2026 academic conference. The app fetches all content from the **Evan API** (a UGent academic conference management system) and builds as a static PWA with offline capabilities.

**Key Architecture:**

- **Frontend:** Vue 3 (Composition API), Quasar Framework v2, TypeScript
- **State:** Pinia stores
- **Data Source:** Evan API (`https://evan.ugent.be/api/v1/`)
- **Build:** Static PWA (not SSR), Vite-based via Quasar CLI
- **Shared Library:** `evan-kit` (local git submodule at `./evan-kit`)

## Critical Setup

### Package Management

Always use **`yarn`** (never npm). Common commands:

- `yarn dev` - Start dev server in PWA mode
- `yarn build` - Build production PWA
- `yarn lint` - ESLint with flat config
- `yarn format` - Prettier formatting

### Path Aliases

Two critical aliases are configured in `quasar.config.ts`:

- `@/` → `src/` (project-specific code)
- `@evan/` → `evan-kit/src/` (shared library)

Use these consistently:

```typescript
import { useEventStore } from '@evan/stores/event';
import { notify } from '@/utils/notify';
```

## evan-kit: The Shared Library

`evan-kit` is a **git submodule** containing reusable Vue components, composables, stores, types, and utilities for Evan-based conference apps.

**What lives in evan-kit:**

- `/stores/event.ts` - Core event/content/program data store
- `/api/client.ts` - Evan API client functions
- `/types/` - TypeScript types for Evan data models
- `/composables/` - `useSearch`, `useFavorites`, `usePersonalCalendar`, etc.
- `/components/MarkedDiv.vue` - Markdown renderer
- `/utils/` - Date formatting, text normalization, etc.

**What lives in src/ (project-specific):**

- `/constants.ts` - Event code, timezone config
- `/components/` - Custom UI components (FplBtn, AvatarDisplay, etc.)
- `/pages/` - Route pages
- `/utils/` - Project-specific utilities (dialog, notify)
- `/icons/` - Icon exports

**Rule:** Don't duplicate evan-kit functionality. If something exists in `@evan`, import it. Only extend or override in `src/` when conference-specific customization is needed.

## Vue Component Standards (CRITICAL)

All `.vue` files **must** follow this exact structure:

```vue
<style scoped>
/* Scoped styles ALWAYS come first */
</style>

<template>
  <!-- Prefer Quasar components: q-btn, q-card, q-input, etc. -->
</template>

<script setup lang="ts">
// Composition API with <script setup> is mandatory
</script>
```

**Key Rules:**

1. `<style>` must be `scoped`
2. Always use `<script setup lang="ts">` (no Options API)
3. Use Quasar components (`<q-btn>`, `<q-card>`) over native HTML
4. Use Quasar utility classes (`q-pa-md`, `row`, `col`, `text-h6`) for layout/spacing

## Global Component Registration

Components registered in `src/boot/components.ts` are globally available without imports:

- `FplBtn` - Custom button component
- `FplSubtitle` - Subtitle component
- `MarkedDiv` (from evan-kit) - Markdown renderer

## Data Flow & Store Pattern

### Initialization (App.vue)

```typescript
import { useEventStore } from '@evan/stores/event';
import { EVAN_EVENT_CODE } from '@/constants';

eventStore.init(EVAN_EVENT_CODE); // Fetches event, contents, sessions, papers, keynotes
```

### Store Structure

The `useEventStore` (from evan-kit) is the **single source of truth** for:

- `event` - Conference metadata, venues, tracks, topics
- `contents` - CMS pages keyed by `content.key`
- `sessions`, `papers`, `keynotes` - Program data
- `programDataLoaded` - Boolean flag for lazy-loaded program data

**Usage Pattern:**

```typescript
const eventStore = useEventStore();
await eventStore.loadProgramData(); // Lazy-load sessions/papers if not already loaded
const mainVenue = eventStore.mainVenue; // Computed property
const aboutContent = eventStore.contentsDict['about']; // Access by key
```

## Styling Conventions

- **Primary Color:** `#0000ff` (blue) - defined in `quasar.variables.scss`
- **Accent Color:** `text-fpl-red` - custom red for timestamps/highlights
- **Icon Set:** `material-symbols-sharp` (configured in `quasar.config.ts`)
- **Responsive:** Use Quasar's `$q.screen.gt.md` for breakpoints

Import icons from `@/icons/`:

```typescript
import { iconRoom, iconStar, iconStarFull } from '@/icons';
```

## PWA & Service Worker

- **Mode:** PWA only (no SPA/SSR)
- **Service Worker:** Custom implementation in `src-pwa/custom-service-worker.ts`
- **API Caching:** Network-first strategy for `evan.ugent.be` with 7-day expiration
- **Manifest:** `src-pwa/manifest.json`

The app **must work offline** after initial load. Ensure all critical data is cached.

## Testing

- **evan-kit has tests** (Vitest) - run `yarn test` inside `evan-kit/`
- **Main app has no tests** (per `package.json` script: `exit 0`)

When adding features to `evan-kit`, write corresponding tests in `evan-kit/tests/`.

## Routing

Routes are in `src/router/routes.ts`. Pattern:

- `strict: true` on all routes (exact path matching)
- Lazy-loaded components: `() => import('pages/...')`
- Nested routes for sections (e.g., `/calls/`, `/committees/`)

## Common Patterns

### Markdown Rendering

Use `MarkedDiv` (global component):

```vue
<MarkedDiv :content="eventStore.contentsDict['about']?.body" />
```

### Search/Filter

Use `useSearch` composable from evan-kit:

```typescript
import { useSearch } from '@evan/composables/useSearch';

const { searchQuery, filteredItems } = useSearch(
  () => eventStore.papers,
  (paper) => [paper.title, paper.authors_string],
  { minSearchLength: 2 },
);
```

### Date Formatting

Use utilities from `@evan/utils/dates`:

```typescript
import { formatImportantDate, dateRange } from '@evan/utils/dates';
```

### Favorites

Use `useFavorites` composable (evan-kit) for localStorage-based favorites:

```typescript
import { useFavorites } from '@evan/composables/useFavorites';

const favorites = useFavorites('sessions'); // 'sessions' | 'papers' | 'keynotes'
favorites.toggle(item.url);
```

## Environment Variables

Set in `quasar.config.ts` → `build.env`:

- `APP_DOMAIN` - Default: `localhost:9200`
- `GIT_COMMIT_HASH` - For build tracking

## Git Workflow

- Use **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Scope examples: `feat(program):`, `fix(api):`, `chore(deps):`
- Keep commits atomic and descriptive

## Evan API Integration

**Base URL:** `https://evan.ugent.be/api/v1/`

**Client pattern (evan-kit/src/api/client.ts):**

```typescript
import { setEventCode, fetchEvent, fetchSessions } from '@evan/api/client';

setEventCode('fpl2026'); // Must be called first
const event = await fetchEvent();
const sessions = await fetchSessions();
```

**Error Handling:**

```typescript
try {
  await eventStore.loadProgramData();
} catch (error) {
  if (error instanceof ApiError) {
    notify.error(error.message);
  }
}
```

## Key Files Reference

- `src/constants.ts` - Event code, timezone, virtual flag
- `quasar.config.ts` - Build config, aliases, plugins
- `src/App.vue` - App initialization, event store setup
- `src/boot/components.ts` - Global component registration
- `src/router/routes.ts` - All application routes
- `evan-kit/src/stores/event.ts` - Core data store
- `evan-kit/src/api/client.ts` - API client functions

## Don't

- ❌ Use npm (use `yarn`)
- ❌ Use Options API (use Composition API with `<script setup>`)
- ❌ Put `<style>` tags at the bottom of `.vue` files
- ❌ Duplicate evan-kit functionality in src/
- ❌ Use native HTML elements when Quasar components exist
- ❌ Forget to make styles `scoped`
- ❌ Import types from node_modules when they exist in `@evan/types`
