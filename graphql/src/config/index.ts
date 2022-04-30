import { fromJust } from "../utils/types";

export const COGNITO_USER_POOL_ID = fromJust(process.env.COGNITO_USER_POOL_ID);
export const COGNITO_REGION = fromJust(process.env.COGNITO_REGION);
