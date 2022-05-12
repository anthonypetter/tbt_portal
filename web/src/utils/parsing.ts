import type { GetServerSidePropsContext } from "next";
import { fromJust } from "utils/types";

export function parseOrgId(mParams: GetServerSidePropsContext["params"]): {
  organizationId: string;
} {
  const params = fromJust(mParams, "params");

  if (typeof params.organizationId !== "string") {
    throw new Error("Unable to parse organizationId from url");
  }

  return {
    organizationId: params.organizationId,
  };
}

export function parseEngagementId(
  mParams: GetServerSidePropsContext["params"]
): {
  engagementId: string;
} {
  const params = fromJust(mParams, "params");

  if (typeof params.engagementId !== "string") {
    throw new Error("Unable to parse engagementId from url");
  }

  return {
    engagementId: params.engagementId,
  };
}
