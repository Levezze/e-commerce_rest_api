    // src/types/express.d.ts

    import { UserJWTPayload } from '../middlewares/auth.middleware.ts'; // Or wherever it lives

    declare global {
      namespace Express {
        interface Request {
          user?: UserJWTPayload;
        }
      }
    }

    // Adding this empty export makes the file a module, which is often necessary.
    export {};
    