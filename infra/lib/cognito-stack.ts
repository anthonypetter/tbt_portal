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

interface CognitoStackProps extends StackProps {
  url: string;
}

export class CognitoStack extends Stack {
  public readonly userPool: UserPool;

  constructor(scope: App, id: string, props: CognitoStackProps) {
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
        tempPasswordValidity: Duration.days(90),
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.RETAIN,
      lambdaTriggers: {
        preSignup,
      },
      userInvitation: {
        emailSubject: `Welcome to Tutored By Teachers!`,
        emailBody: `
          <p>Welcome!</p>
          <p>Congratulations, you've been invited to join the Tutored By Teachers Portal! We are excited to be partnering with you!</p>
          <p>We've created an account for you and have given you a temporary password.</p>
          <br>
          <p><b>Email:</b> {email}</p>
          <p><b>Temporary password:</b> {####}</p>
          <br>
          <p>Please use your temporary password to log in to your account. Once you log in, you'll get a chance to change your password.</p>
          <a href="https://${props.url}/auth/accept-invitation" target="_blank" rel="noopener noreferrer">Go to My Account</a>
          <p>If you have any questions, feel free to contact us at support@tutored.live</p>
          <br>
          <p>Our team is looking forward to working with you!</p>
          <br>
          <p>Regards,</p>
          <p>Shaan Akbar, CEO</p>
        `,
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
