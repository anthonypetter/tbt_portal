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
    details: {
      href: (orgId: string) => `/organizations/${orgId}/details`,
      path: () => "/organizations/[organizationId]/details",
    },
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
    details: {
      href: (orgId: string, engagementId: string) =>
        `/organizations/${orgId}/engagements/${engagementId}/details`,
      path: () =>
        "/organizations/[organizationId]/engagements/[engagementId]/details",
    },
    cohorts: {
      href: (orgId: string, engagementId: string) =>
        `/organizations/${orgId}/engagements/${engagementId}/cohorts`,
      path: () =>
        "/organizations/[organizationId]/engagements/[engagementId]/cohorts",
    },
    uploadCsv: {
      href: (orgId: string, engagementId: string) =>
        `/organizations/${orgId}/engagements/${engagementId}/upload-csv`,
      path: () =>
        "/organizations/[organizationId]/engagements/[engagementId]/upload-csv",
    },
  },

  cohort: {
    href: (orgId: string, engagementId: string, cohortId: string) =>
      `/organizations/${orgId}/engagements/${engagementId}/cohorts/${cohortId}`,
    path: () =>
      "/organizations/[organizationId]/engagements/[engagementId]/cohorts/[cohortId]",
  },

  cohortRoom: {
    href: (cohortId: string, roomType = "host", meetingUrl?: string) =>
      `/cohorts/${cohortId}/room/${roomType}${
        meetingUrl ? "?meetingUrl=" + meetingUrl : ""
      }`,
    path: () => "/cohorts/[cohortId]/room/[roomType]",
  },

  studentRoomUnAuthenticated: {
    href: (meetingUrl: string) => `/student-room?meetingUrl=${meetingUrl}`,
    path: () => `/student-room`,
  },

  cohortDetail: {
    href: (cohortId: string) => `/cohorts/${cohortId}`,
    path: () => "/cohorts",
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
  return [Routes.login, Routes.studentRoomUnAuthenticated];
}
