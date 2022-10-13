# Shopify & Hydrogen Custom starter with React, Redux, SCSS, ESLint, Stylelint & Prettier

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- NPM


## Running the dev server

```bash
npm install
npm run dev
```

Remember to update `hydrogen.config.ts` with your shop's domain and Storefront API token!

## Building for production

```bash
npm run build
```

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `npm run preview`:

```bash
npm run build
npm run preview
```
