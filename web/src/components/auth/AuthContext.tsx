import { createContext } from "react";
import { User } from "@generated/graphql";

/**
 * AuthContext
 */

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextT {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextT | null>(null);
AuthContext.displayName = "AuthContext";
