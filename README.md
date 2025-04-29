# **E-Commerce Jewelry Store API**

## **Overview**

This repository contains the source code for the REST API backend powering a modern e-commerce web application specializing in jewelry. It provides a comprehensive set of endpoints for managing catalog items, user authentication and profiles, shopping carts, order processing, and administrative functions.

Built with Node.js, Express, and TypeScript, this API prioritizes type safety, a clear and maintainable structure following domain-driven principles, and modern development practices. It utilizes PostgreSQL for data persistence and JWT for secure authentication.

This project also serves as a capstone project for the Codecademy Backend Developer curriculum, as part of the Full Stack Engineer Career Course.

## **Features**

* **Authentication:** Secure user registration, login via email/password, JWT-based session management `(/auth)`.  
* **Catalog Management:**  
  * Public browsing of items with filtering, pagination, and sorting (`GET /items`, `GET /items/:id`).  
  * Admin CRUD operations for jewelry items (rings, necklaces, earrings) with support for type-specific properties (`/admin/items`).  
  * Role-based response filtering (admins see more details than public users on the same endpoints).  
* **User Management:** Self-service profile viewing and updates (`/auth/me`). (Admin user management could be added under `/admin/users`).  
* **Shopping Cart:** Add/remove items, update quantities, view cart contents (`/cart`).  
* **Order Processing:** Place orders from cart, view user's order history and details (`/orders`). Admin capabilities for order status updates (`/admin/orders/:id/status`).  
* **API Specification:** Comprehensive OpenAPI 3.1.1 definition for clear contract and client generation.

## **Tech Stack**

* **Backend Framework:** Node.js, Express.js  
* **Language:** TypeScript  
* **Database:** PostgreSQL  
* **Query Builder/DB Interaction:** Kysely (with `kysely-codegen` for type generation)  
* **Authentication:** JWT (JSON Web Tokens) via `jose`, password hashing via `bcrypt`.  
* **Validation:** Zod for robust runtime request validation.  
* **Logging:** Pino (`pino-http` for HTTP requests, `pino-pretty` for development).  
* **API Specification:** OpenAPI 3.1.1 (`docs/openapi.yaml`)  
* **Development Runner:** `tsx` (TypeScript execution with ESM support and watching).

## **API Documentation**

The API contract is defined using the OpenAPI 3.1.1 specification located at `docs/openapi`.yaml.

You can explore and interact with the API documentation by:

1. Pasting the contents of `openapi.yaml` into the [Swagger Editor](https://editor.swagger.io/).  
2. Using tools like [Swagger UI](https://github.com/swagger-api/swagger-ui) if you integrate it into your development server.

## **Project Structure**

```bash
.  
├── db/  
│   └── schema.sql                \# SQL schema definition (for manual setup/reference)  
├── docs/  
│   ├── \*.pdf                     \# Supporting diagrams (optional)  
│   └── openapi.yaml              \# API specification  
├── src/  
│   ├── api/                      \# Feature modules (Components in C4 model)  
│   │   ├── items/                \# Item catalog feature  
│   │   │   ├── controllers/      \# Request handlers (public/admin split)  
│   │   │   ├── services/         \# Business logic  
│   │   │   └── routes/           \# Route definitions (public/admin split)  
│   │   ├── auth/                 \# Authentication feature  
│   │   │   ├── controllers/  
│   │   │   ├── services/  
│   │   │   ├── routes/  
│   │   │   └── middlewares/      \# Auth-specific middleware (requireAuth, requireAdmin)  
│   │   ├── users/                \# User self-service feature (/auth/me)  
│   │   │   ├── controllers/  
│   │   │   ├── services/  
│   │   │   └── routes/  
│   │   ├── orders/               \# Customer order feature  
│   │   │   ├── controllers/  
│   │   │   ├── services/  
│   │   │   └── routes/  
│   │   ├── cart/                 \# Shopping cart feature  
│   │   │   ├── controllers/  
│   │   │   ├── services/  
│   │   │   └── routes/  
│   │   └── admin/                \# Admin-specific features/endpoints  
│   │       ├── controllers/      \# e.g., orders.admin.controller.ts  
│   │       ├── services/         \# (if needed)  
│   │       └── routes/           \# e.g., orders.admin.routes.ts  
│   ├── config/                   \# Configuration loading (e.g., from .env)  
│   ├── core/                     \# Core utilities, base classes, etc.  
│   ├── database/                 \# Database connection, seeding, Kysely setup  
│   │   ├── index.ts              \# Kysely instance export  
│   │   ├── seed.ts               \# Optional seeding script  
│   │   └── types.ts              \# Auto-generated DB interface (via kysely-codegen)  
│   ├── dtos/                     \# Data Transfer Objects (potentially auto-generated from OpenAPI)  
│   │   └── generated/            \# Subfolder if using generation tools  
│   ├── middlewares/              \# Global/Reusable middleware  
│   │   ├── error.middleware.ts   \# Global error handler  
│   │   └── validation.middleware.ts \# Reusable request validation logic  
│   ├── types/                    \# Custom TypeScript type definitions (e.g., extending Express Request)  
│   │   └── express.d.ts  
│   ├── utils/                    \# General utility functions (logger, error classes)  
│   │   ├── errors.ts  
│   │   ├── logger.ts  
│   │   └── logServerStart.ts  
│   ├── validators/               \# Zod validation schemas  
│   │   ├── auth.validators.ts  
│   │   ├── item.validators.ts  
│   │   └── user.validators.ts  
│   ├── app.ts                    \# Express app configuration (middleware, mounting routes)  
│   └── server.ts                 \# Server entry point (starts listening)  
├── .env                          \# Local environment variables (ignored by Git)  
├── .env.example                  \# Example environment variables file  
├── .gitignore  
├── package.json  
├── package-lock.json  
├── README.md                     \# This file  
└── tsconfig.json                 \# TypeScript compiler options
```

## **Getting Started**

### **Prerequisites**

* Node.js (v18 or later recommended)  
* npm (usually comes with Node.js)  
* PostgreSQL (running instance)  
* Git

### **Installation**

1. **Clone the Repository:**  

    ```bash
    git clone \<your-repository-url\> \# Replace with your actual repo URL  
    cd \<repository-folder-name\>
    ```

2. **Install Dependencies:**  

    ```bash
    npm install
    ```

### **Database Setup**

1. **Ensure PostgreSQL is running.**  
2. **Create a database** for the application using a tool like psql or pgAdmin (e.g., jewelry\_store\_dev).  

    ```sql
    \-- Example using psql  
    CREATE DATABASE jewelry\_store\_dev;
    ```

3. **Run the schema definition script** against your new database:  

    ```sql
    \# Replace with your actual username and database name if different  
    psql \-U your\_postgres\_user \-d jewelry\_store\_dev \-f db/schema.sql
    ```

### **Environment Variables**

1. **Create a .env file** in the project root (copy from .env.example if it exists):  

    ```bash
    cp .env.example .env \# Or create .env manually
    ```

2. **Edit the .env file** with your specific configuration:  

    ```env
    \# .env Configuration  
    NODE\_ENV=development

   \# Database Connection (adjust user, password, host, port, dbname as needed)  
   DATABASE\_URL=postgres://YOUR\_DB\_USER:YOUR\_DB\_PASSWORD@localhost:5432/jewelry\_store\_dev

   \# JWT Secret (Generate a strong, random secret\!)  
   \# Use: node \-e "console.log(require('crypto').randomBytes(32).toString('hex'))"  
   JWT\_SECRET=your\_very\_strong\_random\_32\_byte\_hex\_secret\_here

   \# Logging Level ('debug', 'info', 'warn', 'error')  
   LOG\_LEVEL=debug \# Recommended for development
   ```

3. **IMPORTANT:** Ensure .env is listed in your .gitignore file to prevent committing secrets.

### **Database Type Generation**

Kysely uses `kysely-codegen` to generate TypeScript types based on your database schema, ensuring type safety in your database queries. Run this command after setting up the database and `.env` file:

```bash
npm run generate-db-types
```

Run this again anytime you make changes to the database schema defined in `db/schema.sql`.

## **Running the Application**

### **Development Mode**

This mode uses `tsx` for fast, on-the-fly TypeScript execution with file watching and automatic server restarts. Logs are formatted for readability.

```bash
npm run dev:all
```

The server will typically start on `http://localhost:3000` (or the `PORT` specified in `.env`).

### **Production Mode**

1. **Build TypeScript:** Compile your TypeScript code into JavaScript in the `dist` directory.  

    ```bash
    npm run build
    ```

2. **Run Compiled Code:** Start the server using the compiled JavaScript. Ensure `NODE\_ENV` is set to `production` for optimal performance and JSON logging.  

    ```env
    NODE\_ENV=production npm start
    ```

   *(This assumes your `start` script in `package.json` correctly points to the compiled output, e.g., `node dist/server.js`)*

## **Testing with an API Client (e.g., Postman)**

1. Start the application (`npm run dev:all`).  
2. Use an API client like Postman or Insomnia to send requests to the endpoints (base URL: `http://localhost:3000/api/v1`).  
3. Refer to the `docs/openapi.yaml` specification for available endpoints, request bodies, and expected responses.  
4. **Authentication:**  
   * Register a user via `POST /api/v1/auth/register`.  
   * Log in via `POST /api/v1/auth/login` with the registered credentials.  
   * Copy the `token` received in the login response.  
   * For protected endpoints, set the `Authorization` header:  
     * Key: `Authorization`  
     * Value: `Bearer \<your\_copied\_jwt\_token\>`  
   * **(Postman Tip):** You can automate saving the token to a Postman environment variable using a script in the "Tests" tab of the login request (see the example script in your original README).