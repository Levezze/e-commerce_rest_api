# E-Commerce REST API

## Overview

This repository contains a robust, type-safe REST API for a modern e-commerce application. It features:

- Modular architecture with Express, TypeScript, and PostgreSQL (via Supabase).
- Secure authentication (JWT, bcrypt), Zod-based validation, and clear OpenAPI documentation.
- Raw SQL control using [Kysely](https://kysely.dev/) for maximum flexibility and type safety.
- Automated type generation from your live Supabase schema.
- Commit/push validation via Husky hooks (enabled soon).

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
- **Dev Tools:** pnpm, tsx, eslint, prettier, husky, kysely-codegen
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
│   ├── dtos/                # DTOs, OpenAPI/Zod typegen
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

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (see [pnpm installation](https://pnpm.io/installation))
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

- `generate:api-zod`: Generate OpenAPI spec from Zod schemas.
- `generate:db-types`: Generate TypeScript types from Supabase schema.
- `dev`: Run the application in development mode.
- `build`: Build the application for production.
- `start`: Start the application in production mode.
