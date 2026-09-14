import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { FG, MUTED, BG } from "@/theme";

/**
 * Wrap any route that should require a signed-in customer account
 * (e.g. /account, /checkout order history).
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

/**
 * Wrap any route that should require the admin role specifically
 * (e.g. everything under /admin — adding/editing/removing cards).
 * A signed-in customer who is not an admin is bounced to the home page,
 * not shown the admin UI.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG, color: FG }}>
      <div className="text-sm" style={{ color: MUTED }}>
        Loading…
      </div>
    </div>
  );
}
