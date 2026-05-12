import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
