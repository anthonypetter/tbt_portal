# TbT Portal

| Directory | Description                                             |
| --------- | ------------------------------------------------------- |
| cdk-infra | AWS Infrastructure as code via CDK                      |
| copilot   | copilot generated directory containing deploy manifests |
| web       | NextJS app for portal                                   |
| graphql   | Apollo GraphQL Server + Prisma ORM                      |

## Local Development Environment

To run the application locally, you'll need to run both the apollo server backend and the NextJS frontend.

1. First, follow the instructions found in the [graphql README](https://github.com/TutoredByTeachers/tbt-portal/blob/main/graphql/README.md). Get apollo-server up and running.

2. After you have apollo-server up, Follow the instructions in the [web README](https://github.com/TutoredByTeachers/tbt-portal/blob/main/web/README.md) to get NextJS app running.
