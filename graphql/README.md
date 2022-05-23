# Apollo Server

## Local Development Environment

1. Ensure you've changed your directory to be in this directory. (`graphql`)

2. To spin up a local instance of postgres via docker compose, run:

```bash
docker compose -f docker-compose-db.yml up -d
```

3. Once DB is running, start apollo server locally by running (still in `graphql` directory)

```
npm run dev
```

3. If this is your first time setting up the db, run the following `db:setup` command. This will apply all migrations and run the `seed.ts` script.

```bash
npm run db:setup
```

If all goes well, you should see something like:

```
🚀 Server ready at: http://localhost:4000
```

Navigate to http://localhost:4000 to bring up Apollo's graph explorer studio.

Currently, all endpoints are authenticated so you'll probably run into some authentication errors. We'll need to create a cognito user for you. Once we do, you can login to the frontend app where a bearer auth token will be genereated for you. To get Apollo graphql explorer to work for you, you'll need to place the generated token in the "Authorization" header.

It should look like this:

| Header        | Value               |
| ------------- | ------------------- |
| Authorization | Bearer {your_token} |
