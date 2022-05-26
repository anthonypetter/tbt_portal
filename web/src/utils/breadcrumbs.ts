import { HomeIcon } from "@heroicons/react/solid";
import { type Breadcrumb } from "components/Breadcrumbs";
import { Routes } from "./routes";

type Options = {
  current: boolean;
};

export const breadcrumbs = {
  home: (): Breadcrumb => ({
    name: "Home",
    href: Routes.home.href(),
    icon: HomeIcon,
  }),

  organizations: (
    options: Options | undefined = { current: false }
  ): Breadcrumb => ({
    name: "Organizations",
    href: Routes.organizations.href(),
    current: options.current,
  }),

  cohorts: (options: Options | undefined = { current: false }): Breadcrumb => ({
    name: "Cohorts",
    href: Routes.cohorts.href(),
    current: options.current,
  }),

  engagements: (
    options: Options | undefined = { current: false }
  ): Breadcrumb => ({
    name: "Engagements",
    href: Routes.engagements.href(),
    current: options.current,
  }),

  teachers: (
    options: Options | undefined = { current: false }
  ): Breadcrumb => ({
    name: "Teachers",
    href: Routes.engagements.href(),
    current: options.current,
  }),

  liveView: (
    options: Options | undefined = { current: false }
  ): Breadcrumb => ({
    name: "Live View",
    href: Routes.liveView.href(),
    current: options.current,
  }),

  mySchedule: (
    options: Options | undefined = { current: false }
  ): Breadcrumb => ({
    name: "My Schedule",
    href: Routes.mySchedule.href(),
    current: options.current,
  }),

  recordings: (
    options: Options | undefined = { current: false }
  ): Breadcrumb => ({
    name: "Recordings",
    href: Routes.recordings.href(),
    current: options.current,
  }),
};
