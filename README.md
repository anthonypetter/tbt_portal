# TbT Portal

| Directory | Description                           |
| --------- | ------------------------------------- |
| infra     | AWS Infrastructure as code via CDK    |
| copilot   | directory containing deploy manifests |
| web       | NextJS app for portal                 |
| graphql   | Apollo GraphQL Server + Prisma ORM    |

## Local Development Environment

### AWS

- Store your AWS credentials under the `~/.aws` directory. You can setup both `~/.aws/credentials` and `~/.aws/config`.
- For more info on how this should look, follow this guide: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
- The AWS region we're using is `us-east-2`.

### Node

- We're using Node v16.14. Use of [Node Version Manager](https://github.com/nvm-sh/nvm) for version management is recommended.

### Env files

We use [Doppler](https://www.doppler.com/) as our secrets manager. There should be no need for `env` files unless doing something custom.

To get both the frontend and backend running, you first need to get Doppler set up on your machine:

1. Install the [Doppler CLI](https://docs.doppler.com/docs/install-cli).
2. Authenticate into the CLI via `doppler login`. For this work, you need to have been invited to our Doppler team account. If you haven't been invited, reach out in the #engineering channel.
3. Once authenticated, run `doppler setup` in both directories (`graphql` and `web`). Since each directory has its own `doppler.yaml` file, you'll be asked if you want to use the settings from the corresponding config file. Type `yes` to both. That will setup both your `web` and `graphql` projects to point to the corresponding doppler project. They're both setup to use a "dev_local" config.

Once you have doppler set up, you should be ready to proceed.

### Backend

- Follow the instructions found in the [graphql README](https://github.com/TutoredByTeachers/tbt-portal/blob/main/graphql/README.md). Get apollo-server up and running.

### Frontend

- After you have apollo-server up, Follow the instructions in the [web README](https://github.com/TutoredByTeachers/tbt-portal/blob/main/web/README.md) to get NextJS app running.
