import {
  CognitoIdentityProvider,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { COGNITO_USER_POOL_ID, COGNITO_REGION } from "../config";
import { AuthenticationError } from "apollo-server";
import { fromJust } from "../utils/types";
import { UserService } from "../services/user";
import find from "lodash/find";
import { ValidationError } from "../utils/errors";

type CognitoSub = string;

const cognitoClient = new CognitoIdentityProvider({
  region: COGNITO_REGION,
});

/**
 * Gets a user based on cognito bearer token in auth header
 * @param authHeader request authorization header
 */

export async function authenticateUser(authHeader: string | undefined) {
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

  return UserService.getUserByCognitoSub(
    fromJust(mCognitoSub, "cognitoSub value")
  );
}

/**
 * creates a cognito user. Account status defaults to pending.
 * @param email user's email
 * @returns Cognito sub id
 */

export async function createCognitoUser(email: string): Promise<CognitoSub> {
  try {
    const { User: mUser } = await cognitoClient.adminCreateUser({
      DesiredDeliveryMediums: ["EMAIL"],
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    });

    const { Attributes: mAttrs } = fromJust(mUser, "CognitoUser");
    const Attributes = fromJust(mAttrs, "CognitoUser.Attributes");
    const mSub = Attributes.find(({ Name }) => Name === "sub");
    return fromJust(mSub?.Value, "CognitoUser Sub Value");
  } catch (error) {
    if (error instanceof Error && error.name === "UsernameExistsException") {
      console.error("adminCreateUser", error);
      throw new ValidationError(error.message);
    }
    throw error;
  }
}

/**
 * Gets a cognito user from a token
 * @param token cognito access token
 * @returns CognitoUser
 */
async function getCognitoUserFromToken(
  token: string
): Promise<GetUserCommandOutput> {
  return cognitoClient.getUser({
    AccessToken: token,
  });
}
