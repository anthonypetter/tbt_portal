# Graphql Backend - Apollo Server

## Local Development Environment

Before getting started, ensure you have the following:

- [x] AWS creds in `~/.aws/credentials` as per [AWS Docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [x] You're using Node v16.14.1 (use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- [x] Doppler is installed and configured (more info on how to do that [here](https://github.com/TutoredByTeachers/tbt-portal#env-files))
- [x] [Docker Compose](https://docs.docker.com/compose/install) installed

Once that is in place, follow these steps:

1. Ensure you've changed your directory to `graphql` (this directory).

2. Install dependencies by running

```bash
npm install
```

3. To spin up a local instance of postgres via docker compose, run:

```bash
docker compose -f docker-compose-db.yml up -d
```

4. Once DB is running, start apollo server locally by running (still in `graphql` directory)

```bash
npm run dev
```

5. If this is your first time setting up the db, run the following `db:setup` command. This will apply all prisma migrations and run the `seed.ts` script.

```bash
npm run db:setup
```

Hopefully you'll see some seed script logs being outputted.

Once the server is up and running, you should see:

```
🚀 Server ready at: http://localhost:4000
```

Navigate to http://localhost:4000 to bring up Apollo's graph explorer studio.

Currently, all endpoints are authenticated so you'll probably run into some authentication errors. We'll need to create a cognito user for you (in AWS visit the Cognito service on us-east-2).

Once we make the Cognito user, you can login to the frontend app where a bearer auth token will be genereated for you. Check the console for a printout of the token and make sure to copy the **entire token** (it can be over 1000 characters long).

To get Apollo graphql explorer to work for you, you'll need to place the generated token in the "Authorization" header.

It should look like this:

| Header        | Value               |
| ------------- | ------------------- |
| Authorization | Bearer {your_token} |

An example query you can run to confirm things are running correctly:

```graphql
query getCurrentUser {
  currentUser {
    id
    email
    accountStatus
  }
}
```

## Debugging

### VSCode

When running the `dev` script you can have VSCode attach to the Node inspection port using the _Run and Debug_ configuration "/graphql: Node (attach)". It will attach on port 9229.
