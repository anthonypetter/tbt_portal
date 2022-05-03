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
