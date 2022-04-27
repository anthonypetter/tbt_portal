import {
  App,
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  CfnOutput,
} from "aws-cdk-lib";
import {
  UserPool,
  AccountRecovery,
  ClientAttributes,
} from "aws-cdk-lib/aws-cognito";
import { AssetCode, Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
export class CognitoStack extends Stack {
  public readonly userPool: UserPool;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const preSignup = new Function(this, "preSignupFn", {
      code: Code.fromAsset(path.join(__dirname, "../../lambdas/build")),
      handler: "preSignUp.handler",
      runtime: Runtime.NODEJS_14_X,
    });

    const USER_POOL_NAME = "tbt-portal-pool";
    const userPool = new UserPool(this, "userpool", {
      userPoolName: USER_POOL_NAME,
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true,
        },
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.RETAIN,
      lambdaTriggers: {
        preSignup,
      },
    });

    const userPoolClient = userPool.addClient("UserPoolClient", {
      userPoolClientName: "tbt-web",
      refreshTokenValidity: Duration.days(14),
      readAttributes: new ClientAttributes().withStandardAttributes({
        email: true,
        emailVerified: true,
      }),
    });

    // Outputs
    new CfnOutput(this, "UserPoolName", { value: USER_POOL_NAME });
    new CfnOutput(this, "UserPoolID", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "UserPoolClientID", {
      value: userPoolClient.userPoolClientId,
    });

    this.userPool = userPool;
  }
}
