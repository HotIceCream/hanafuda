# UI Tests for Hanafuda Score Tracker

This directory contains UI tests using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

- Run all tests: `npm test`
- Run tests in UI mode: `npm run test:ui`
- Run tests in headed mode (see browser): `npm run test:headed`
- Debug tests: `npm run test:debug`

## Test Structure

Tests are located in `tests/hanafuda.spec.js` and cover:

- Initial page load and setup
- Game initialization
- Player name customization
- Winner selection
- Yaku combination selection
- Deal submission and score calculation
- Deal history
- Deal editing
- Language switching
- Number input controls
- Validation
- Game reset
- LocalStorage persistence

## Test Coverage

The tests verify:
- UI elements are visible and functional
- User interactions work correctly
- Score calculations are accurate
- Game state persists across page reloads
- Language switching works
- Form validation prevents invalid submissions



