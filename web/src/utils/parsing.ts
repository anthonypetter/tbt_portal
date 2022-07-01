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

export function parseCohortId(mParams: GetServerSidePropsContext["params"]): {
  cohortId: string;
} {
  const params = fromJust(mParams, "params");

  if (typeof params.cohortId !== "string") {
    throw new Error("Unable to parse cohortId from url");
  }

  return {
    cohortId: params.cohortId,
  };
}

export function parseMeetingUrl(mParams: GetServerSidePropsContext["query"]): {
  meetingUrl: string;
} {
  const params = fromJust(mParams);
  if (typeof params.meetingUrl !== "string") {
    throw new Error("Unable to parse meetingUrl from url");
  }

  return {
    meetingUrl: params.meetingUrl,
  };
}
