import "dotenv/config";

interface EnvConfig {
  port: number;
  nodeEnv: "development" | "production" | "test";
  corsOrigin: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
  frontendUrl: string;
  oauthEncryptionKey: string;
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  github: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: (process.env.NODE_ENV as EnvConfig["nodeEnv"]) ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  mongodbUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "30d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),

  // Where the browser is sent back to once an OAuth flow completes.
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",

  // Used to encrypt OAuth access/refresh tokens at rest. Not `required()`
  // at boot so the rest of the app keeps working without it — the OAuth
  // routes themselves fail clearly if it's missing when actually used.
  oauthEncryptionKey: process.env.OAUTH_ENCRYPTION_KEY ?? "",

  // OAuth connector credentials — deliberately optional at boot. Only the
  // /oauth/* routes need these, and they validate their own provider's
  // config before use so the rest of the API is unaffected if these are
  // left unset in development.
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:4000/oauth/google/callback",
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    redirectUri: process.env.GITHUB_REDIRECT_URI ?? "http://localhost:4000/oauth/github/callback",
  },
};
