# Contributing to Nutrition+

Thanks for your interest in contributing! This is a personal/portfolio project, but PRs and issue reports are genuinely welcome.

## Getting set up

Follow the [Getting Started](./README.md#getting-started) section in the README first — clone, install, get a free Gemini API key, and confirm `npx expo start` runs locally.

## Finding something to work on

- Check the [Issues](../../issues) tab
- Issues tagged **`good first issue`** are scoped to be approachable without needing to understand the whole codebase
- If you have an idea not already listed, open an issue first to discuss before starting work — helps avoid duplicate effort

## Making a change

1. Fork the repo and create a branch:

```bash
   git checkout -b fix/short-description
```

2. Make your changes. Keep PRs focused — one fix or feature per PR is easier to review than a bundle of unrelated changes.
3. Test locally on at least one platform (iOS simulator, Android emulator, or Expo Go on a physical device) before opening a PR.
4. Commit with a clear message describing _what_ changed and _why_:

```bash
   git commit -m "Add swipe-to-delete for logged meals"
```

5. Push and open a PR against `main`. Include:
   - What the change does
   - How you tested it
   - Screenshots/screen recording for any UI change

## Code style

- TypeScript throughout — please keep new code typed, avoid `any` where reasonably possible
- Match existing patterns in the file you're editing (e.g. how `scan-result.tsx` structures state/handlers) rather than introducing a new pattern
- Keep API routes (`+api.ts`) consistent with the existing ones — same JSON response shape conventions, same error handling style

## Reporting bugs

Open an issue with:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Platform (iOS/Android/web) and Expo Go vs. dev build

## Questions

Open a [Discussion](../../discussions) or just ask in an issue — happy to help people get oriented in the codebase.
