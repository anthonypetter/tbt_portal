import {
  CognitoIdentityProvider,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoRegion } from "../config";
import { AuthenticationError } from "apollo-server";
import { fromJust } from "../utils/types";
import { UserService } from "../services/user";
import find from "lodash/find";

const cognitoClient = new CognitoIdentityProvider({
  region: CognitoRegion,
});

/**
 * Gets a user based on cognito bearer token in auth header
 * @param authHeader request authorization header
 */

export async function getUser(authHeader: string | undefined) {
  if (!authHeader) {
    throw new AuthenticationError("Auth header is missing.");
  }

  // Strip "Bearer"
  const accessToken = authHeader.split(" ")[1];

  // Get cognito user and inspect attributes
  const cognitoUser = await getCognitoUserFromToken(accessToken);
  const userAttributes = fromJust(
    cognitoUser.UserAttributes,
    "cognitoUser.UserAttributes"
  );

  const mCognitoSub = fromJust(
    find(userAttributes, (attr) => attr.Name === "sub"),
    "cognitoSub attribute"
  ).Value;

  const user = await UserService.getUserByCognitoSub(
    fromJust(mCognitoSub, "cognitoSub value")
  );

  return user;
}

async function getCognitoUserFromToken(
  token: string
): Promise<GetUserCommandOutput> {
  return cognitoClient.getUser({
    AccessToken: token,
  });
}
