// ============================================================
// TeamHub Frontend — useAuth Hook
// ============================================================

import { useCallback, useMemo } from "react";
import {
  getSession,
  getCurrentUser,
  isAuthenticated as checkAuth,
  login as doLogin,
  logout as doLogout,
} from "@/lib/auth";
import { ROLE_HIERARCHY } from "@/lib/constants";
import type { MemberRole } from "@/types";

export function useAuth() {
  const session = getSession();
  const user = getCurrentUser();
  const authenticated = checkAuth();

  const hasRole = useCallback(
    (requiredRole: MemberRole): boolean => {
      if (!user) return false;
      return (
        (ROLE_HIERARCHY[user.role] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0)
      );
    },
    [user]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      return doLogin(email, password);
    },
    []
  );

  const logout = useCallback(async () => {
    return doLogout();
  }, []);

  return useMemo(
    () => ({
      user,
      session,
      isAuthenticated: authenticated,
      hasRole,
      login,
      logout,
    }),
    [user, session, authenticated, hasRole, login, logout]
  );
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
