import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: string; // user id
}

// @types/jsonwebtoken types `expiresIn` as `number | ms.StringValue`, not a
// plain `string` — env.jwtExpiresIn is read from process.env so it's a bare
// string. Assert it against the library's own option type at the one place
// it's used, rather than widening env's type or the payload/secret args.
const jwtExpiresIn = env.jwtExpiresIn as SignOptions["expiresIn"];

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies JwtPayload, env.jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
