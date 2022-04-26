import * as cognito from "aws-cdk-lib/aws-cognito";
import * as cdk from "aws-cdk-lib";

export class CognitoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const USER_POOL_NAME = "tbt-portal-pool";
    const userPool = new cognito.UserPool(this, "userpool", {
      userPoolName: USER_POOL_NAME,
      selfSignUpEnabled: true,
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
        fullname: {
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
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const userPoolClient = userPool.addClient("UserPoolClient", {
      userPoolClientName: "tbt-web",
      refreshTokenValidity: cdk.Duration.days(14),
      readAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
        fullname: true,
        emailVerified: true,
      }),
    });

    // Outputs
    new cdk.CfnOutput(this, "UserPoolName", { value: USER_POOL_NAME });
    new cdk.CfnOutput(this, "UserPoolID", {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientID", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
