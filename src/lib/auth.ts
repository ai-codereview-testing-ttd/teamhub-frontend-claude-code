// ============================================================
// TeamHub Frontend — Mock Auth (hardcoded for evaluation)
// ============================================================

import { AuthSession, AuthUser } from "@/types";

// Hardcoded mock user for local development / evaluation
// Matches seeded data from seed-data.js (John Doe - OWNER)
const MOCK_USER: AuthUser = {
  id: "user_01HQ3XK123",
  email: "john@acme.com",
  name: "John Doe",
  organizationId: "org_01HQ3XJMR5E0987654321",
  role: "OWNER",
};

// Hardcoded JWT token — this is a real HS256 JWT signed with
// the dev secret from AppConfig. Decodes to the MOCK_USER claims.
// Generated with: node generate-token.js
const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAxSFEzWEsxMjMiLCJpc3MiOiJ0ZWFtaHViLWFwaSIsImVtYWlsIjoiam9obkBhY21lLmNvbSIsIm9yZ2FuaXphdGlvbklkIjoib3JnXzAxSFEzWEpNUjVFMDk4NzY1NDMyMSIsImlhdCI6MTc3MDg0NzM1NywiZXhwIjoxODAyMzgzMzU3fQ.FLMY-6yfeAyr_1T0bEioMfFCPDQt9zUNzN-FOO7X93U";

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
