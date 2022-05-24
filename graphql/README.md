# Apollo Server

## Local Development Environment

Before getting started, ensure you have the following:

- [] AWS creds
- [] An invite to our doppler team account and the [doppler CLI](https://docs.doppler.com/docs/install-cli) installed.
- [] [docker compose](https://docs.docker.com/compose/install) installed.
- [] You're using Node v16.14.1

Once that is in place, follow these steps:

1. Ensure you've changed your directory to `graphql` (this directory).

2. Intall dependencies by running

```
npm install
```

3. To spin up a local instance of postgres via docker compose, run:

```bash
docker compose -f docker-compose-db.yml up -d
```

4. Once DB is running, start apollo server locally by running (still in `graphql` directory)

```
npm run dev
```

5. If this is your first time setting up the db, run the following `db:setup` command. This will apply all migrations and run the `seed.ts` script.

```bash
npm run db:setup
```

Hopefully you'll see some seed script logs being outputted.

Once the server is up and running, you should see:

```
🚀 Server ready at: http://localhost:4000
```

Navigate to http://localhost:4000 to bring up Apollo's graph explorer studio.

Currently, all endpoints are authenticated so you'll probably run into some authentication errors. We'll need to create a cognito user for you. Once we do, you can login to the frontend app where a bearer auth token will be genereated for you. To get Apollo graphql explorer to work for you, you'll need to place the generated token in the "Authorization" header.

It should look like this:

| Header        | Value               |
| ------------- | ------------------- |
| Authorization | Bearer {your_token} |
