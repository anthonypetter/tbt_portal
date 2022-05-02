import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStack } from "../lib/cognito-stack";
import { GraphQLServerStack } from "../lib/graphql-stack";

export class PortalApp extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const devEnv: StackProps["env"] = {
      account: "014491063547",
      region: "us-east-2",
    };

    const stageEnv: StackProps["env"] = {
      account: "014491063547",
      region: "us-east-2",
    };

    const cognito = new CognitoStack(app, "PortalCognito", {
      env: devEnv,
      url: "",
    });

    new GraphQLServerStack(app, "GraphQlServerStack", {
      env: devEnv,
      userPool: cognito.userPool,
    });
  }
}

const app = new App();
new PortalApp(app, "PortalApp");
app.synth();
