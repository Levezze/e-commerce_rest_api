// src/types/express.d.ts

import { UserJWTPayload } from '../middlewares/auth.middleware.ts'; // Or wherever it lives
import { z } from 'zod';
import { schemas } from '../dtos/generated/zod.d.ts';

declare global {
  namespace Express {
    interface Request {
      user?: UserJWTPayload;
      role?: z.infer<typeof schemas.UserRole>;
    }
  }
}

// Adding this empty export makes the file a module, which is often necessary.
export { };
