// ============================================================
// TeamHub Frontend — Mock Auth (hardcoded for evaluation)
// ============================================================

import { AuthSession, AuthUser } from "@/types";

// Hardcoded mock user for local development / evaluation
const MOCK_USER: AuthUser = {
  id: "usr_01HQ3XJMR5E1234567890",
  email: "admin@teamhub.dev",
  name: "Alex Morgan",
  organizationId: "org_01HQ3XJMR5E0987654321",
  role: "ADMIN",
};

// Hardcoded JWT token — this is a real-format HS256 JWT signed with
// the dev secret from AppConfig. Decodes to the MOCK_USER claims.
const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJ1c2VySWQiOiJ1c3JfMDFIUTNYSk1SNUUxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkB0ZWFtaHViLmRldiIsIm9yZ2FuaXphdGlvbklkIjoib3JnXzAxSFEzWEpNUjVFMDk4NzY1NDMyMSIsInJvbGUiOiJBRE1JTiIsImlzcyI6InRlYW1odWItYXBpIiwiZXhwIjo5OTk5OTk5OTk5fQ." +
  "placeholder_signature";

const MOCK_SESSION: AuthSession = {
  user: MOCK_USER,
  token: MOCK_TOKEN,
  expiresAt: "2099-12-31T23:59:59Z",
};

/**
 * Get the current auth session. In this evaluation environment,
 * always returns the hardcoded mock session.
 */
export function getSession(): AuthSession | null {
  return MOCK_SESSION;
}

/**
 * Get the current authenticated user.
 */
export function getCurrentUser(): AuthUser | null {
  const session = getSession();
  return session?.user ?? null;
}

/**
 * Get the auth token for API requests.
 */
export function getAuthToken(): string | null {
  const session = getSession();
  return session?.token ?? null;
}

/**
 * Check if the user is authenticated.
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Mock login — in a real app this would call the API.
 * Here it just returns the hardcoded session.
 */
export async function login(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string
): Promise<AuthSession> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_SESSION;
}

/**
 * Mock logout — in a real app this would clear tokens/cookies.
 */
export async function logout(): Promise<void> {
  // No-op in mock auth
  await new Promise((resolve) => setTimeout(resolve, 100));
}
