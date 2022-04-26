export enum Env {
  DEV = "dev",
  TEST = "test",
}

export const config = {
  env: getEnv(),

  cognito: {
    REGION: process.env.NEXT_PUBLIC_REGION,
    USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
    APP_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  },
};

function getEnv() {
  if (process.env.NODE_ENV === "test") {
    return Env.TEST;
  }

  return process.env.NEXT_PUBLIC_ENV !== null &&
    process.env.NEXT_PUBLIC_ENV !== undefined
    ? process.env.NEXT_PUBLIC_ENV
    : Env.DEV;
}
