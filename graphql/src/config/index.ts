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

export const S3_RECORDINGS_BUCKET = fromJust(
  process.env.S3_RECORDINGS_BUCKET,
  "process.env.S3_BUCKET_NAME"
);

export const AWS_ACCESS_ID = fromJust(
  process.env.AWS_ACCESS_ID,
  "process.env.AWS_ACCESS_ID"
);

export const AWS_SECRET_ACCESS_KEY = fromJust(
  process.env.AWS_SECRET_ACCESS_KEY,
  "process.env.AWS_SECRET_ACCESS_KEY"
);

export const AWS_REGION = fromJust(
  process.env.AWS_REGION,
  "process.env.AWS_REGION"
);
