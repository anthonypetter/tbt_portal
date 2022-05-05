import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStack } from "../lib/cognito-stack";
import { assertUnreachable, fromJust } from "../utils/types";

type EnvDetails = {
  stage: CdkStage;
  domain: string;
  env: NonNullable<StackProps["env"]>;
};

export enum CdkStage {
  Dev = "dev",
  Staging = "staging",
}

const cdkStage = fromJust(process.env.CDK_STAGE, "CDK_STAGE") as CdkStage;

if (![CdkStage.Dev, CdkStage.Staging].includes(cdkStage)) {
  throw new Error(`CDK_STAGE value not supported: '${cdkStage}'`);
}

export class PortalApp extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const envDetails = getEnvironmentDetails(cdkStage);

    new CognitoStack(app, `PortalCognito${getSuffix(cdkStage)}`, {
      env: envDetails.env,
      domain: envDetails.domain,
      stage: envDetails.stage,
    });
  }
}

function getEnvironmentDetails(stage: CdkStage): EnvDetails {
  switch (stage) {
    case CdkStage.Dev:
      return {
        stage: CdkStage.Dev,
        domain: "dev.tutored-stage.live",
        env: {
          account: "014491063547",
          region: "us-east-2",
        },
      };

    case CdkStage.Staging:
      return {
        stage: CdkStage.Staging,
        domain: "tutored-stage.live",
        env: {
          account: "014491063547",
          region: "us-east-2",
        },
      };

    default:
      assertUnreachable(stage, "stage");
  }
}

function getSuffix(stage: CdkStage) {
  switch (stage) {
    case CdkStage.Dev:
      return "-dev";

    case CdkStage.Staging:
      return ""; //TODO: change later to -stage

    default:
      assertUnreachable(stage, "stage");
  }
}

const app = new App();
new PortalApp(app, `PortalApp${getSuffix(cdkStage)}`);
app.synth();
