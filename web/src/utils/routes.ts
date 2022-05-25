export const Routes = {
  home: {
    href: () => "/",
    path: () => "/",
  },
  login: {
    href: () => "/login",
    path: () => "/login",
  },
  liveView: {
    href: () => "/live-view",
    path: () => "/live-view",
  },
  mySchedule: {
    href: () => "/my-schedule",
    path: () => "/my-schedule",
  },
  organizations: {
    href: () => "/organizations",
    path: () => "/organizations",
  },
  org: {
    engagements: {
      href: (orgId: string) => `/organizations/${orgId}/engagements`,
      path: () => "/organizations/[organizationId]/engagements",
    },
    cohorts: {
      href: (orgId: string) => `/organizations/${orgId}/cohorts`,
      path: () => "/organizations/[organizationId]/cohorts",
    },
  },
  engagement: {
    cohorts: {
      href: (orgId: string, engagementId: string) =>
        `/organizations/${orgId}/engagements/${engagementId}/cohorts`,
      path: () =>
        "/organizations/[organizationId]/engagements/[engagementId]/cohorts",
    },
  },

  cohort: {
    href: (orgId: string, engagementId: string, cohortId: string) =>
      `/organizations/${orgId}/engagements/${engagementId}/cohorts/${cohortId}`,
    path: () =>
      "/organizations/[organizationId]/engagements/[engagementId]/cohorts/[cohortId]",
  },

  engagements: {
    href: () => "/engagements",
    path: () => "/engagements",
  },
  cohorts: {
    href: () => "/cohorts",
    path: () => "/cohorts",
  },
  users: {
    href: () => "/users",
    path: () => "/users",
  },
  teachers: {
    href: () => "/teachers",
    path: () => "/teachers",
  },
  recordings: {
    href: () => "/recordings",
    path: () => "/recordings",
  },
};

export function getUnauthenticatedRoutes() {
  return [Routes.login];
}
