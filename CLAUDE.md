# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # type-check + production build
npm run lint       # run ESLint
npm run lint -- --fix  # auto-fix lint errors (use this instead of manually reordering)
npm run preview    # preview production build
```

## Architecture

**mise** is a React 19 / Vite / TypeScript single-page app — an AI meal-prep chat interface.

**Pages vs Components:** Pages (`src/pages/`) own state and orchestrate composition. Components (`src/components/`) are purely presentational and receive everything via props. State never lives in a component.

**Component structure:** Each component gets its own folder containing a `.tsx` file and a `.types.ts` file for its prop types — no inline type definitions in the component file itself.

**UI stack:** HeroUI (`@heroui/react`) for interactive primitives + Tailwind CSS v4 via `@tailwindcss/vite`. Brand tokens are defined in `src/index.css` under `@theme` (colors: `ember`, `moss`, `cream`, `bark`, `char`, `ash`, `smoke`, `parchment`, `paper`, `linen`; fonts: `--font-body`, `--font-display`). HeroUI semantic tokens are overridden in `:root` to match the culinary **light theme** — `parchment` (#FDFAF6) background, `bark` foreground, `paper` surfaces, with `ember` and `moss` as accents.

**ESLint** uses `eslint-plugin-perfectionist` (`recommended-natural`) which enforces alphabetical ordering of imports and object properties. Always run `npm run lint -- --fix` to auto-fix ordering errors rather than reordering manually.
