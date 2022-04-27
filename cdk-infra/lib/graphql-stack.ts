import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  User,
  PolicyStatement,
  Effect,
  CfnAccessKey,
} from "aws-cdk-lib/aws-iam";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

interface Props extends StackProps {
  userPool: IUserPool;
}

export class GraphQLServerStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const user = new User(this, "User");

    user.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.userPool.userPoolArn],
        actions: ["cognito-idp:AdminCreateUser"],
      })
    );

    const accessKey = new CfnAccessKey(this, "AccessKey", {
      userName: user.userName,
    });

    // Outputs
    new CfnOutput(this, "AccessKeyID", { value: accessKey.ref });
    new CfnOutput(this, "AccessKeySecret", {
      value: accessKey.attrSecretAccessKey,
    });
  }
}
