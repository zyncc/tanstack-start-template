# [React TanStarter](https://github.com/dotnize/react-tanstarter)

A minimal starter template for 🏝️ TanStack Start. [→ Preview here](https://tanstarter.nize.ph/)

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## Getting Started

We're using **pnpm** by default, but you can modify the scripts in [package.json](./package.json) to use your preferred package manager.

1. [Use this template](https://github.com/new?template_name=react-tanstarter&template_owner=dotnize) or clone this repository with gitpick:

   ```bash
   npx gitpick dotnize/react-tanstarter myapp
   cd myapp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example).

4. Push the schema to your database with drizzle-kit:

   ```bash
   pnpm db push
   ```

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   ```bash
   pnpm dev
   ```

   The development server should now be running at [http://localhost:3000](http://localhost:3000).

## Issue watchlist

- [React Compiler docs](https://react.dev/learn/react-compiler), [Working Group](https://github.com/reactwg/react-compiler/discussions) - React Compiler is in RC.
- https://github.com/TanStack/router/discussions/2863 - TanStack Start is in beta may still undergo major changes.

## Goodies

#### Scripts

These scripts in [package.json](./package.json#L5) use **pnpm** by default, but you can modify them to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/db/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/auth/index.ts).
- **`db`** - Run drizzle-kit commands. (e.g. `pnpm db generate` to generate a migration)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button` to add the button component)
- **`format`**, **`lint`**, **`check-types`** - Run Prettier, ESLint, and check TypeScript types respectively.
  - **`check`** - Run all three above. (e.g. `pnpm check`)
- **`deps`** - Selectively upgrade dependencies via taze.

#### Utilities

- [`auth-guard.ts`](./src/lib/auth/middleware/auth-guard.ts) - Sample middleware for forcing authentication on server functions. (see [#5](https://github.com/dotnize/react-tanstarter/issues/5#issuecomment-2615905686) and [#17](https://github.com/dotnize/react-tanstarter/issues/17#issuecomment-2853482062))
- [`theme-toggle.tsx`](./src/components/theme-toggle.tsx) - A simple component to toggle between light and dark mode. ([#7](https://github.com/dotnize/react-tanstarter/issues/7))

## Building for production

Read the [hosting docs](https://tanstack.com/start/latest/docs/framework/react/hosting) for information on how to deploy your TanStack Start app.

## License

Code in this template is public domain via [Unlicense](./LICENSE). Feel free to remove or replace for your own project.

## Also check out

- [create-tsrouter-app](https://github.com/TanStack/create-tsrouter-app/tree/main/cli/create-tsrouter-app) - The official CLI tool from the TanStack team to create Router/Start applications.
- [CarlosZiegler/fullstack-start-template](https://github.com/CarlosZiegler/fullstack-start-template) - A more batteries-included boilerplate that provides a solid foundation for building modern web apps.
