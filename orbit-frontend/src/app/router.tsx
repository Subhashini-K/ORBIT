import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, SignupPage, ForgotPasswordPage } from "@/features/auth";
import { RequireAuth } from "./RequireAuth";
import { GuestOnly } from "./GuestOnly";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import SourcesPage from "@/features/sources/pages/SourcesPage";
import ChatPage from "@/features/chat/pages/ChatPage";
import MemoryPage from "@/features/memory/pages/MemoryPage";
import InsightsPage from "@/features/insights/pages/InsightsPage";
import AutomationsPage from "@/features/automations/pages/AutomationsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import OAuthCallbackPage from "@/features/oauth/pages/OAuthCallbackPage";
import { OAuthCallbackPage as AuthOAuthCallbackPage } from "@/features/auth/pages/OAuthCallbackPage";
import { NotFoundPage } from "@/components/common/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },

  // Guest-only auth routes
  { path: "/login", element: <GuestOnly><LoginPage /></GuestOnly> },
  { path: "/signup", element: <GuestOnly><SignupPage /></GuestOnly> },
  { path: "/forgot-password", element: <GuestOnly><ForgotPasswordPage /></GuestOnly> },

  // OAuth Auth callback (for sign-in with Google/GitHub)
  { path: "/auth/callback", element: <AuthOAuthCallbackPage /> },

  // Authenticated app routes
  { path: "/dashboard", element: <RequireAuth><DashboardPage /></RequireAuth> },
  { path: "/sources", element: <RequireAuth><SourcesPage /></RequireAuth> },
  { path: "/chat", element: <RequireAuth><ChatPage /></RequireAuth> },
  { path: "/memory", element: <RequireAuth><MemoryPage /></RequireAuth> },
  { path: "/insights", element: <RequireAuth><InsightsPage /></RequireAuth> },
  { path: "/automations", element: <RequireAuth><AutomationsPage /></RequireAuth> },
  { path: "/settings", element: <RequireAuth><SettingsPage /></RequireAuth> },
  { path: "/oauth/callback", element: <RequireAuth><OAuthCallbackPage /></RequireAuth> },

  { path: "*", element: <NotFoundPage /> },
]);
