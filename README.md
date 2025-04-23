# E-Commerce Jewelry Store API

## Description

This repository contains the source code for the REST API backend powering a modern e-commerce web application specializing in jewelry. It provides endpoints for managing catalog items, user authentication, shopping carts, orders, and more.

This project also serves as a capstone project for the Codecademy Backend Developer curriculum, as part of the Full Stack Engineer Career Course.

The API is built with a focus on type safety, clear structure, and modern development practices using Node.js, Express, and TypeScript.

## Features

* **Authentication:** User registration, login via email/password, JWT-based session management.
* **Items:** CRUD operations for jewelry catalog items (rings, necklaces, earrings) with support for specific properties based on type. Includes filtering, pagination, and sorting for browsing.
* **Users:** Manage user profiles (details potentially including address).
* **Cart:** Add/remove items, update quantities, view cart contents, initiate checkout.
* **Orders:** Place orders from cart, view order history, view specific order details, update order status (potentially admin-only).
* **(Potential Future Features based on Schema):** Reviews, Tags for items.

## Tech Stack

* **Backend Framework:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **Query Builder/DB Interaction:** Kysely (with `kysely-codegen` for type generation)
* **Authentication:** JWT (JSON Web Tokens) using the `jose` library, password hashing with `bcrypt`.
* **Validation:** Zod for runtime request validation.
* **Logging:** Pino (with `pino-http` for request logging and `pino-pretty` for development).
* **API Specification:** OpenAPI 3.1.1 (`docs/openapi.yaml`)
* **Development Runner:** `tsx` (for running TypeScript directly with ESM support)

## API Documentation

The API contract is defined using the OpenAPI 3.1.1 specification located at `docs/openapi.yaml`.

You can view the interactive documentation by pasting the contents of `openapi.yaml` into the [Swagger Editor](https://editor.swagger.io/).

## Project Structure

```bash
e-commerce_rest_api/
├─ db/
│  └─ schema.sql         # SQL schema definition (reference/manual setup)
├─ dist/                  # Compiled JavaScript output (for production)
├─ docs/                  # Documentation files (OpenAPI spec, diagrams)
├─ node_modules/          # Project dependencies
├─ src/                   # Main source code
│  ├─ db/                 # Kysely setup and generated DB types
│  │  ├─ index.ts       # Kysely instance configuration
│  │  └─ types.ts       # Auto-generated DB interface (via kysely-codegen)
│  ├─ dtos/               # Data Transfer Objects (API contract types from OpenAPI)
│  ├─ server/             # Express server application logic
│  │  ├─ app.ts         # Express app configuration (middleware, routes)
│  │  ├─ index.ts       # Server entry point (starts listening)
│  │  ├─ controllers/   # Request handlers, calls services
│  │  ├─ middlewares/   # Express middleware (auth, validation, error handling, logging)
│  │  ├─ routes/        # Route definitions, connects paths to controllers
│  │  ├─ services/      # Business logic, database interactions
│  │  └─ utils/         # Utility functions (e.g., logger)
│  └─ validators/         # Zod validation schema definitions
├─ .env                   # Environment variables (DB connection, JWT secret) - DO NOT COMMIT
├─ .gitignore             # Files/folders ignored by Git
├─ package.json           # Project metadata and dependencies
├─ package-lock.json      # Dependency lock file
├─ README.md              # This file
└─ tsconfig.json          # TypeScript compiler configuration
```

## Setup and Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/Levezze/e-commerce_rest_api
    cd e-commerce_rest_api
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Setup PostgreSQL Database:**
    * Ensure you have PostgreSQL installed and running.
    * Create a database for the application (e.g., `jewelry_api_dev`).
    * Run the schema definition script against your newly created database:

        ```bash
        # Connect to your PostgreSQL instance (e.g., using psql or pgAdmin)
        # Make sure you are connected to the 'jewelry_api_dev' database
        # Then execute the schema file:
        psql -U your_postgres_user -d jewelry_api_dev -f db/schema.sql
        ```

        (Replace `your_postgres_user` if needed).

4. **Configure Environment Variables:**
    * Create a `.env` file in the root of the project by copying the example:

        ```bash
        cp .env.example .env # Or create .env manually
        ```

    * Edit the `.env` file with your specific configuration:

        ```dotenv
        # .env Example
        DATABASE_URL=postgres://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/jewelry_api_dev
        PORT=3000 # Optional: Port the server will run on
        NODE_ENV=development # Set to 'production' for production builds

        # Generate a strong secret using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        JWT_SECRET=your_super_strong_random_jwt_secret_key_here

        LOG_LEVEL=info # Or 'debug' for more verbose logs in development
        ```

    * **Important:** Add `.env` to your `.gitignore` file to avoid committing secrets.

5. **Generate Database Types (if schema changes):**

    If you modify the database schema later, regenerate the Kysely types:

    ```bash
    npm run generate-db-types
    ```

## Running the Application

* **Development Mode:**

  * Uses `tsx` for on-the-fly TypeScript execution with file watching.
  * Uses `pino-pretty` for human-readable logs.
  * Includes continuous type checking via `tsc --watch`.

    ```bash
    npm run dev:all
    ```

    The server will typically start on `http://localhost:3000` (or the port specified in `.env`).

* **Production Mode:**
    1. **Build TypeScript:** Compile TypeScript to JavaScript in the `dist` folder.

        ```bash
        npm run build
        ```

    2. **Run Compiled Code:** Start the server using Node.js, reading the compiled files. Set `NODE_ENV=production`. Logs will be in JSON format.

        ```bash
        NODE_ENV=production npm start
        # Or: NODE_ENV=production node dist/server/index.js
        ```

## Testing with Postman

* Use an API client like Postman or Insomnia to interact with the endpoints (e.g., `http://localhost:3000/api/v1/...`).
* **Authentication:**

    1. Send a `POST` request to `/api/v1/auth/login` with valid user credentials in the body.
    2. In the "Tests" tab of the Postman request, add the following script to automatically save the received token to an environment variable named `jwtToken`:

        ```javascript
        try {
            let jsonData = pm.response.json();
            if (jsonData && jsonData.token) {
                pm.environment.set("jwtToken", jsonData.token);
                console.log("JWT Token saved.");
            }
        } catch (e) { console.error("Error saving token:", e); }
        ```

    3. For requests to protected endpoints, go to the "Authorization" tab, select "Bearer Token", and put `{{jwtToken}}` in the "Token" field. Postman will automatically use the saved token.
