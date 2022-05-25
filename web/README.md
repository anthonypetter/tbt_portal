# NextJS Frontend

## Local Development Environment

Before getting started, ensure you have the following:

- [x] AWS creds
- [x] You're using Node v16.14.1
- [x] Doppler is installed and configured. More info on how to do that here: https://github.com/TutoredByTeachers/tbt-portal#env-files

1. Ensure you've changed your directory to be the `web` directory. (this directory)

2. Install dependencies by running

```
npm install
```

3. To run the development server, issue the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app

## Log in

To login, there are a couple more manual steps needed (to be automated later).

1. Ask #engineering to send you an invitation through the portal app. That will do two things:

- it will send you an invitation email with a temporary password.
- it will create a user record in the dev environment and mark the user as pending. The user record contains your cognito sub.

This is fine for https://dev.tutored-stage.live, but not for your local DB. Since your database is local, you'll have to add your user record manually.

2. To add yourself to your local DB, add your user to the seed.ts file in the `graphql/prisma/seed.ts` file:

Add yourself to the `devUsers` array:

```js
{
  email: "your-email@tutored.live",
  fullName: "your full name",
  cognitoSub: "put-your-cognito-sub-here", // grab this from cognito in aws console
  createdAt: new Date(),
  role: "ADMIN",
  accountStatus: "ACTIVE",
}
```

3. Once added, re-seed your local DB. In the `graphql` directory, run

```
npm run db:seed
```

4. At this point, you should be ready to log in. Use your temporary password to log in. You should be requested to change your password after authenticating.
