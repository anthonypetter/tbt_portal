import { fromJust } from "../utils/types";

export const COGNITO_USER_POOL_ID = fromJust(
  process.env.COGNITO_USER_POOL_ID,
  "process.env.COGNITO_USER_POOL_ID"
);

export const COGNITO_REGION = fromJust(
  process.env.COGNITO_REGION,
  "process.env.COGNITO_REGION"
);

export const WHEREBY_URL = fromJust(
  process.env.WHEREBY_URL,
  "process.env.WHEREBY_URL"
);

export const WHEREBY_API_KEY = fromJust(
  process.env.WHEREBY_API_KEY,
  "process.env.WHEREBY_API_KEY"
);

export const S3_BUCKET = fromJust(
  process.env.S3_BUCKET,
  "process.env.S3_BUCKET"
);
