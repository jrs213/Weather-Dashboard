# vue-spa-starter

A simple template for building Vue 3 single-page apps with TypeScript, UnoCSS, and Pinia.

> **Note:** This branch is intentionally overcommented for educational purposes. Comments are more detailed than usual to help new developers understand each part of the codebase.

## What is this?

This repo is a starting point for new Vue developers. It includes:

- **Vue 3** for building user interfaces
- **TypeScript** for type safety
- **UnoCSS** for utility-first styling
- **Pinia** for state management

## How to Use

1. Clone the repo and run `npm install` to install dependencies.
2. Start the development server with `npm run dev`.
3. Edit components in `src/components` and pages in `src/views`.

## How is it commented?

- Comments are written to be clear and beginner-friendly.
- Each file explains what it does and why.
- Code blocks and functions have short comments describing their purpose.
- Stores and components include tips on how to use them in your app.

## Key Features

- **Design tokens**: CSS variables for colors, fonts, and spacing are defined in `src/assets/main.css` for easy theming.
- **UnoCSS integration**: Utility classes use your design tokens for consistent styling.
- **Pinia stores**: State is managed in simple, well-commented stores (see `src/stores/user.ts`).

## Example: Using a Store

```ts
// Import the store in your component
import { useUserStore } from '@/stores/user'

const user = useUserStore()
// Access state: user.isLoggedIn
// Call actions: user.toggleLoginState()
```

## Learn More

- [Vue documentation](https://vuejs.org/)
- [UnoCSS documentation](https://unocss.dev/)
- [Pinia documentation](https://pinia.vuejs.org/)

---

This template is designed to be easy to read, easy to extend, and a great place to start learning Vue development.
