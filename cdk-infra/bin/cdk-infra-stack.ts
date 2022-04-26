import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStack } from "../lib/cognito-stack";

export class PortalApp extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cognitoPool = new CognitoStack(app, "PortalCognito", {
      // env: context.env,
      // url: `my.${context.domain}`,
      // domain: context.domain,
    });
  }
}

const app = new App();
new PortalApp(app, "PortalApp");
app.synth();
