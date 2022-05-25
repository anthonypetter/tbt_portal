import { createContext } from "react";
import { CognitoUser } from "@aws-amplify/auth";
import { CurrentUserQuery } from "@generated/graphql";

/**
 * AuthContext
 */

export enum LoginStatus {
  Success = "SUCCESS",
  ChangePassword = "CHANGE_PASSWORD",
  Failure = "FAILURE",
}

interface LoginResult {
  status: LoginStatus;
  // TODO: figure out how to type cognitoUser. The amplify login return type is "CognitoUser | any"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cognitoUser: CognitoUser | any;
  message: string;
}

interface AuthContextT {
  user: CurrentUserQuery["currentUser"];
  login: (email: string, password: string) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  onCompleteNewPassword: () => void;
}

export const AuthContext = createContext<AuthContextT | null>(null);
AuthContext.displayName = "AuthContext";
