import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

import { authRouter } from "./features/auth/auth.routes.js";
import { sourcesRouter } from "./features/sources/sources.routes.js";
import { activitiesRouter } from "./features/activities/activities.routes.js";
import { automationsRouter } from "./features/automations/automations.routes.js";
import { dashboardRouter } from "./features/dashboard/dashboard.routes.js";
import { profileRouter } from "./features/profile/profile.routes.js";
import { memoriesRouter } from "./features/memories/memories.routes.js";
import { insightsRouter } from "./features/insights/insights.routes.js";
import { oauthRouter } from "./features/oauth/oauth.routes.js";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  if (env.nodeEnv !== "test") {
    app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
  }

  // A general limiter for the whole API, plus a stricter one specifically
  // for auth endpoints (the most common brute-force target).
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/auth", authLimiter, authRouter);
  app.use("/sources", sourcesRouter);
  app.use("/activities", activitiesRouter);
  app.use("/automations", automationsRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/profile", profileRouter);
  app.use("/memories", memoriesRouter);
  app.use("/insights", insightsRouter);
  app.use("/oauth", oauthRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
