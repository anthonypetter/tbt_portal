# Apollo Server

## Local Development Environment

To run the apollo server locally

1. Ensure you've changed your directory to be in this directory. (`graphql`)

2. Run the following command:

```bash
docker compose up
```

This will spin up `postgres` and `apollo server` locally.

3. If this is your first time setting up the db, run the following `db:setup` command. This will apply all migrations and run the `seed.ts` script.

```bash
npm run db:setup
```

If all goes well, you should see something like:

```
graphql-apollo-server-1  | 🚀 Server ready at: http://localhost:4000
```

Navigate to http://localhost:4000 to bring up Apollo's graph explorer studio.

There's nothing in there yet, but you can test the API by issuing:

```graphql
query Test {
  hello
}
```

You should get back:

```
{
  "data": {
    "hello": "world!"
  }
}
```
