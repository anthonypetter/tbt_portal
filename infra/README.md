# Infra

[AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html) is currently only being used to setup our Cognito Pools. There's one pool per environment. All other resources are deployed with copilot.

## Environments

We have 2 environments: dev, staging. Both dev and staging are hosted on the same AWS account. To specify which environment to deploy to, we use a `CDK_STAGE` environment variable.

Example usage:

```
CDK_STAGE=dev cdk diff
```

```
CDK_STAGE=staging cdk diff
```

Once we're ready, we'll add a production environment.

## Deployments

```
CDK_STAGE=dev cdk deploy --all
```

```
CDK_STAGE=staging cdk deploy --all
```

## Other Commands

- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
