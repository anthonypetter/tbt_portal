# NextJS Frontend

## Local Development Environment

Before getting started, ensure you have the following:

- [x] AWS creds in `~/.aws/credentials` as per [AWS Docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
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

### Resetting a Password

Until we add support for resetting a password there is an [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) command that will do it:

```bash
aws cognito-idp admin-set-user-password --user-pool-id <poolIdFoundOnAWS> --username <userEmail> --password <someTempPassword>
```

You'll find the pool ID by visiting the Cognito page for the group your user account belongs to.

After that has completed, log in with that temporary password and then write yourself a new password (it can be the same).

## Debugging

### VSCode

There are pre-made VSCode debug launch and attach configurations provided so you can debug the code running in a browser inside VSCode.

(Easier): Launch a new browser instance from the "Run and Debug" dropdown by selecting the configuration with "(launch)" in the title.

(Advanced): If you'd prefer to work with your main browser instance you can launch your browser in the terminal with the remote debugging port opened. Then from the "Run and Debug" dropdown select the configuration with "(attach)" in the title.

On macOS, you can use these aliases in your bash/zsh profile and you can more readily launch your browser with a single word.

```bash
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9223"
alias edge="/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222"
```

Chrome is set in the launch config to use port 9223, Edge uses 9222.

[Chromium Projects: Run Chromium with flags](https://www.chromium.org/developers/how-tos/run-chromium-with-flags/)
[List of Chromium Command Line Switches: remote-debugging-port](https://peter.sh/experiments/chromium-command-line-switches/#remote-debugging-port)
