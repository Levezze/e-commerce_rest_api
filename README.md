# E-Commerce REST API

## Overview

This repository contains a robust, type-safe REST API for a modern e-commerce application. It features:

- Modular architecture with Express, TypeScript, and PostgreSQL (via Supabase).
- Uses `pnpm` for fast, reliable dependency management (migrated from npm).
- Secure authentication (JWT, bcrypt), Zod-based validation, and clear OpenAPI documentation.
- Raw SQL control using [Kysely](https://kysely.dev/) for maximum flexibility and type safety.
- Automated type generation from your live Supabase schema.
- Commit/push validation via Husky hooks (`.husky` directory) for pre-commit and pre-push checks.

The project is designed for maintainability, extensibility, and clarity for new contributors.

## API Docs

You can view the interactive Swagger UI here:

👉 [View API Docs in Swagger Editor Next](https://editor-next.swagger.io/?url=https://raw.githubusercontent.com/Levezze/e-commerce_rest_api/master/docs/openapi.yaml)

## **Features**

- **Authentication:** Secure user registration, login via email/password, JWT-based session management `(/auth)`.  
- **Catalog Management:**  
  - Public browsing of items with filtering, pagination, and sorting (`GET /items`, `GET /items/:id`).  
  - Admin CRUD operations for items with support for type-specific properties (`/admin/items`).  
  - Role-based response filtering (admins see more details than public users on the same endpoints).  
- **User Management:** Self-service profile viewing and updates (`/auth/me`). (Admin user management could be added under `/admin/users`).  
- **Shopping Cart:** Add/remove items, update quantities, view cart contents (`/cart`).  
- **Order Processing:** Place orders from cart, view user's order history and details (`/orders`). Admin capabilities for order status updates (`/admin/orders/:id/status`).  
- **API Specification:** Comprehensive OpenAPI 3.1.1 definition for clear contract and client generation.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase-managed)
- **DB Access:** Kysely (raw SQL, with codegen types)
- **Validation:** Zod
- **Authentication:** JWT (jose), bcrypt
- **API Spec:** OpenAPI 3.1.1 (generated from Zod schemas)
- **Dev Tools:** pnpm (preferred), tsx, eslint, prettier, husky, kysely-codegen
- **Logging:** Pino, pino-http, pino-pretty

## API Documentation

- The OpenAPI 3.1.1 spec is auto-generated from Zod schemas using a script (see `generate:api-zod` in package.json).
- See `docs/openapi.yaml` for the latest API contract.
- You can view/interact with the API using [Swagger Editor](https://editor.swagger.io/) or tools like Swagger UI.

## File Structure

```
.
├── .husky/                  # Git hooks for commit/push validation
├── db/
│   ├── generic_db_schema.dbml
│   └── schema.pgsql         # Main schema for Supabase Postgres
├── docs/
│   ├── example_user.json
│   ├── Generic Item DB.pdf
│   └── openapi.yaml         # Generated OpenAPI spec
├── src/
│   ├── api/                 # Domain modules (auth, items, users, etc)
│   ├── database/            # Kysely setup, typegen, plugins
│   ├── dtos/                # DTOs
│   │   ├── generated/       # Auto-generated types from OpenAPI (via openapi-zod-client)
│   │   └── custom/          # Custom/fixed Zod types (see below)
│   │       └── zod.ts       # Main Zod schemas, using extendBase pattern
│   ├── middlewares/
│   ├── server/              # app entry point
│   ├── types/               # Custom TypeScript types
│   ├── utils/               # Utilities
│   └── validators/          # Zod schemas
├── .env                     # Project secrets (Supabase, JWT, etc)
├── package.json
├── pnpm-lock.yaml
├── README.md
├── reset-db.sh
├── tsconfig.json
└── ...
```

## DTOs & Type Generation

### OpenAPI/Zod Typegen
- DTOs are generated using [`openapi-zod-client`](https://github.com/asteasolutions/openapi-zod-client), output to `src/dtos/generated/`.
- Due to limitations in auto-generation (especially with Zod discriminated unions), we move and adapt the generated types in `src/dtos/custom/zod.ts`.
- We use a custom `extendBase` function to safely compose item types for discriminated unions:

```ts
function extendBase<T extends z.ZodRawShape>(fields: T) {
  return z.object({ ...ItemBase.shape, ...fields });
}
```

This fixes issues where auto-generated Zod types failed typechecks for discriminated unions. Example:

```ts
const GenericItem = extendBase({
  kind: z.literal("GenericItem"),
  frameColor: FrameColor,
  modulePackage: ModulePackage,
}).passthrough();
```

### Manual User Creation
- To manually add a user (e.g., the first admin) directly in SQL, use `hashPassword.js` to hash a password:

```bash
pnpm exec tsx hashPassword.js
```

This will print a bcrypt hash for the password "adminadmin" (edit as needed). Insert the hash into the `users` table.

## SQL Schema & Triggers
- The schema (`db/schema.pgsql`) now includes triggers and functions for:
  - Auto-generating `password_reset_token` and `password_reset_expires` fields on user creation
  - Normalizing tag names
  - Auto-updating `updated_at` timestamps on relevant tables

---

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (see [pnpm installation](https://pnpm.io/installation)) — required, as the project now uses pnpm workspaces and lockfile
- Supabase Postgres project (or a local Postgres instance)
- Git

### Installation

1. **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    # (npm install is no longer supported)
    ```

### Database Setup

1. **Connect your Supabase project** (or local Postgres) and ensure your `.env` is configured with the correct `DATABASE_URL`.
2. **Apply the schema:**
    - For Supabase: Use the [Supabase SQL editor](https://app.supabase.com/project/_/sql) to run `db/schema.pgsql`.
    - For local Postgres:

      ```bash
      psql -U <user> -d <db> -f db/schema.pgsql
      ```

### Environment Variables

1. Copy `.env.example` to `.env` and fill in your Supabase/Postgres credentials, JWT secret, etc.
2. Example:

    ```env
    DATABASE_URL=postgres://username:password@host:port/db
    JWT_SECRET=your_jwt_secret
    # ...other config
    ```

3. `.env` is gitignored by default.

### Database Type Generation

After your database and `.env` are set up, generate TypeScript types from your Supabase schema:

```bash
pnpm generate:db-types
```

Run this again whenever your schema changes. Types are output to `src/database/types.ts`.

## Running the Application

### Development

```bash
pnpm dev
```

- Runs both the server (with hot reload) and type checking in parallel.
- Default: <http://localhost:3000>

### Production

```bash
pnpm build
pnpm start
```

- Build outputs to `dist/`. Server runs from compiled files.

## API Usage & Testing

- Start the app (`pnpm dev`).
- Use Postman/Insomnia to hit endpoints (default: `http://localhost:3000`).
- See `docs/openapi.yaml` for endpoint details and schemas.
- Auth endpoints: Register (`POST /auth/register`), Login (`POST /auth/login`), use returned JWT as `Authorization: Bearer <token>`.

## Scripts

The following scripts are available in `package.json`:

- `generate:api-zod`: Generate Zod DTOs from OpenAPI spec (output to `src/dtos/generated/`).
- `generate:db-types`: Generate TypeScript types from Supabase schema.
- `dev`: Run the application in development mode.
- `build`: Build the application for production.
- `start`: Start the application in production mode.
- `prepare`: Installs Husky git hooks.
