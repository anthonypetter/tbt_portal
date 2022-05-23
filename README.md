# TbT Portal

| Directory | Description                           |
| --------- | ------------------------------------- |
| infra     | AWS Infrastructure as code via CDK    |
| copilot   | directory containing deploy manifests |
| web       | NextJS app for portal                 |
| graphql   | Apollo GraphQL Server + Prisma ORM    |

## Local Development Environment

### Node

We're using Node v16.14. Use of [Node Version Manager](https://github.com/nvm-sh/nvm) for version management is recommended.

To run the application locally, you'll need to run both the apollo server backend and the NextJS frontend.

### Backend

Follow the instructions found in the [graphql README](https://github.com/TutoredByTeachers/tbt-portal/blob/main/graphql/README.md). Get apollo-server up and running.

### Frontend

After you have apollo-server up, Follow the instructions in the [web README](https://github.com/TutoredByTeachers/tbt-portal/blob/main/web/README.md) to get NextJS app running.
