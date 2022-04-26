import { Amplify } from "aws-amplify";
import { config } from "../config";

export function configureAmplify() {
  Amplify.configure({
    ssr: true,
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
  });
}
