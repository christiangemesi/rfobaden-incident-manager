# Frontend: Introduction

The frontend of the IncidentManager is implemented in TypeScript. It's built using [React](https://reactjs.org/) with [Next.js](https://nextjs.org/). It loads data from the backend and displays them as HTML/CSS.

## Structure

The overall structure follows the standard Next.js project layout.

- `components` contains reusable React components.
- `models` contains data type definitions and helper functions for them.
- `pages` contains [Next.js pages](https://nextjs.org/docs/basic-features/pages).
- `public` contains [static assets](https://nextjs.org/learn/basics/assets-metadata-css/assets).
- `services` contains service objects, which encapsulate shared functionality.
- `stores` contains reactive, client-side data storage.
- `typings` contains [TypeScript declaration files](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html).
- `utils` contains generalized utility methods and helpers.

## Further Reading

- [`React Components`](./002-react-components.md)
- [`Styled Components`](./003-styled-components.md)
- [`Services and Helpers`](./004-services-and-helpers.md)
- [`Stores`](./005-stores.md)