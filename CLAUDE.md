# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm generate     # Static site generation
pnpm preview      # Preview production build
pnpm postinstall  # Run after install (nuxt prepare)
```

No test runner is configured. Linting uses `@nuxt/eslint` with a flat config (`eslint.config.mjs`).

## Architecture

**FinFlow** is a personal finance SPA built with Nuxt 4 (SSR disabled, SPA mode). The app root is `app/` (Nuxt 4 layout convention).

### Plugin initialization chain (order matters)

Plugins run in numeric order:

1. `app/plugins/01.api.ts` — creates the Axios instance (`$api`) with auth token injection from `localStorage` and global error handling via `vue-sonner` toasts
2. `app/plugins/02.services.ts` — instantiates all API service factories using `$api`, provides them as `$services`
3. `app/plugins/03.vue-query.ts` — sets up TanStack Query with 5-minute stale time

All services are accessed via `useNuxtApp().$services.<name>` throughout the app.

### Data flow

```
API (Laravel backend) → Axios ($api) → Service layer → TanStack Query composable → Vue component
```

- **Services** (`app/services/`) — thin wrappers around `$api` calls. Each validates API responses with Zod schemas and shows toast notifications on success/error. Pattern: `createXxxService(api: AxiosInstance)` factory.
- **Composables** (`app/composables/`) — wrap services with TanStack Query (`useQuery`/`useMutation`). Each composable owns its query key(s) and handles cache invalidation on mutations.
- **Stores** (`app/stores/`) — Pinia stores for cross-cutting state only: `useAuthStore` (token + user in localStorage), `useModalStore` (which global modal is open and its edit data).

### TanStack Query keys

| Key                                        | Composable                                |
| ------------------------------------------ | ----------------------------------------- |
| `["categories"]`                           | `useCategories`                           |
| `["groups"]`                               | `useGroups`                               |
| `["accounts"]`                             | `useAccounts`                             |
| `["transactions", params]`                 | `useTransactions`                         |
| `["recent_transactions"]`                  | `useTransactions`                         |
| `["transactions-sum-groups", filters]`     | `useTransactions.getSumByGroupsQuery`     |
| `["transactions-sum-categories", filters]` | `useTransactions.getSumByCategoriesQuery` |

`refreshFinancialData()` in `useTransactions` invalidates all financial keys at once — call it after any mutation that affects balances.

### Global modals

All CRUD modals are mounted once in `app/app.vue` and controlled via `useModalStore`. To open a modal for create: `modalStore.openXxx()`. To open for edit: `modalStore.openXxx(entityWithId)`. The modal emits `@success` (triggers store close) and `@update:is-open`.

### Auth

- Token stored in `localStorage` as `auth_token`; user object as `auth_token`
- `app/middleware/auth.global.ts` guards all routes — redirects unauthenticated users to `/login`, authenticated users away from public routes
- Route names use `___` locale suffix (e.g. `login___uk`); the middleware strips it when checking public routes

### i18n

Two locales: `uk` (default) and `en`. Locale files at `app/locales/`. Strategy is `prefix` — all routes are prefixed (`/uk/`, `/en/`). Use `NuxtLinkLocale` and `useLocalePath()` for navigation, never bare `NuxtLink` to avoid locale stripping.

### UI components

Shadcn-style components live in `app/components/ui/`. All are auto-imported by Nuxt with the `Ui` prefix (e.g. `<UiButton>`, `<UiDialog>`). They are built on `reka-ui` primitives and styled with Tailwind v4. The `cn()` utility (`app/lib/utils.ts`) merges class names via `clsx` + `tailwind-merge`.

Charts use `@unovis/vue` (`VisDonut`, `VisSingleContainer`) wrapped in custom `UiChartContainer`.

### Types

All domain types are defined with Zod schemas in `app/types/` and re-exported from `app/types/index.ts`. Each type file exports: a Zod schema (e.g. `CategorySchema`), the inferred TS type (`Category`), and derived create/update schemas (`CreateCategorySchema`, `UpdateCategorySchema`). Services use these schemas to validate API responses at runtime.

### Forms

Forms use `vee-validate` with `@vee-validate/zod` for schema binding. Pattern: `toTypedSchema(ZodSchema)` → `useForm({ validationSchema })` → `UiFormField` / `UiFormItem` / `UiFormMessage` components.

### Runtime config

`NUXT_PUBLIC_API_URL` env var sets the backend base URL (maps to `runtimeConfig.public.apiUrl`).\

## Code Style Rules

- Component prefixes: all Shadcn UI components use `Ui` prefix (`UiButton`, `UiCard`)
- `<script setup>` always goes before `<template>` and `<style>`
- No static text in templates — use `$t('key.path')` exclusively
- New i18n keys must be provided as JSON (uk/en)
- Tailwind v4 only — no v3 classes or approaches
- Use `pnpm` exclusively, never `npm` or `yarn`
