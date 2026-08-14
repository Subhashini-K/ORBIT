import "express";

declare module "express-serve-static-core" {
  interface Request {
    /** Populated by the `requireAuth` middleware after verifying the JWT. */
    userId?: string;
  }
}
