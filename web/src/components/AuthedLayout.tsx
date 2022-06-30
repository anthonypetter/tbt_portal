import { UserRole } from "@generated/graphql";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarIcon, HomeIcon, XIcon } from "@heroicons/react/outline";
import { Routes } from "@utils/routes";
import { assertUnreachable, fromJust } from "@utils/types";
import clsx from "clsx";
import sortBy from "lodash/sortBy";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { BiVideoRecording } from "react-icons/bi";
import { FaGraduationCap, FaRegBuilding } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdWorkspacesOutline } from "react-icons/md";
import { RiSignalTowerFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { useAuth } from "./auth/AuthProvider";
import { AuthHeader } from "./AuthHeader";
import { useTheme } from "./ThemeProvider";

type SidebarLink = {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  current: boolean;
  order: number;
  disabled: boolean;
};

function getNavigation(role: UserRole, currentPathname: string) {
  const commonTeacherLinks: SidebarLink[] = [
    {
      name: "Home",
      href: Routes.home.href(),
      icon: HomeIcon,
      current: Routes.home.path() === currentPathname,
      order: 10,
      disabled: false,
    },
    {
      name: "My Schedule",
      href: Routes.mySchedule.href(),
      icon: CalendarIcon,
      current: Routes.mySchedule.path() === currentPathname,
      order: 20,
      disabled: false,
    },
  ];

  const mentorTeacherLinks: SidebarLink[] = commonTeacherLinks;
  const tutorTeacherLinks: SidebarLink[] = commonTeacherLinks;
  const adminOnlyLinks: SidebarLink[] = [
    {
      name: "Live View",
      href: Routes.liveView.href(),
      icon: RiSignalTowerFill,
      current: Routes.liveView.path() === currentPathname,
      order: 30,
      disabled: true,
    },
    {
      name: "Organizations",
      href: Routes.organizations.href(),
      icon: FaRegBuilding,
      current: currentPathname.includes(Routes.organizations.path()),
      order: 40,
      disabled: false,
    },
    {
      name: "Engagements",
      href: Routes.engagements.href(),
      icon: MdWorkspacesOutline,
      current: Routes.engagements.path() === currentPathname,
      order: 50,
      disabled: false,
    },
    {
      name: "Cohorts",
      href: Routes.cohorts.href(),
      icon: SiGoogleclassroom,
      current: currentPathname.startsWith(Routes.cohorts.path()),
      order: 60,
      disabled: false,
    },
    {
      name: "Teachers",
      href: Routes.teachers.href(),
      icon: FaGraduationCap,
      current: Routes.teachers.path() === currentPathname,
      order: 70,
      disabled: true,
    },
    {
      name: "Schedules",
      href: Routes.mySchedule.href(),
      icon: CalendarIcon,
      current: Routes.mySchedule.path() === currentPathname,
      order: 80,
      disabled: false,
    },
    {
      name: "Users",
      href: Routes.users.href(),
      icon: FiUsers,
      current: Routes.users.path() === currentPathname,
      order: 90,
      disabled: false,
    },
    {
      name: "Recordings",
      href: Routes.recordings.href(),
      icon: BiVideoRecording,
      current: Routes.recordings.path() === currentPathname,
      order: 100,
      disabled: true,
    },
  ];

  switch (role) {
    case UserRole.Admin:
      return sortBy(adminOnlyLinks, (n) => n.order).filter(
        (link) => link.disabled === false
      );

    case UserRole.MentorTeacher:
      return mentorTeacherLinks.filter((link) => link.disabled === false);

    case UserRole.TutorTeacher:
      return tutorTeacherLinks.filter((link) => link.disabled === false);

    default:
      assertUnreachable(role, "role");
  }
}

type Props = {
  children: React.ReactNode;
};

export function AuthedLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const { sidebar } = useTheme();
  const auth = useAuth();
  const user = fromJust(auth.user, "auth.user");

  const navigation = getNavigation(user.role, router.pathname);

  return (
    <div>
      {/* Pop-open sidebar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div
              className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 ${sidebar.mainBackground}`}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <CheckmarkTitle />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link href={item.href} key={item.name}>
                      <a
                        className={clsx(
                          item.current
                            ? `${sidebar.activeLinkBackground} ${sidebar.activeLinkText}`
                            : `${sidebar.inactiveLinkText} ${sidebar.inactiveLinkBackgroundHover}`,
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={clsx(
                            "mr-4 flex-shrink-0 h-6 w-6",
                            item.current
                              ? sidebar.activeIconColor
                              : sidebar.inactiveIconColor
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div
          className={`flex flex-col flex-grow pt-5 ${sidebar.mainBackground} overflow-y-auto`}
        >
          <div className="flex items-center flex-shrink-0 px-4">
            <CheckmarkTitle />
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link href={item.href} key={item.name}>
                  <a
                    className={clsx(
                      item.current
                        ? `${sidebar.activeLinkBackground} ${sidebar.activeLinkText}`
                        : `${sidebar.inactiveLinkText} ${sidebar.inactiveLinkBackgroundHover}`,
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "mr-3 flex-shrink-0 h-6 w-6",
                        item.current
                          ? sidebar.activeIconColor
                          : sidebar.inactiveIconColor
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {/* Top bar + Content container */}
      <div className="md:pl-64 flex flex-col flex-1">
        <AuthHeader setSidebarOpen={setSidebarOpen} />
        {/* Content area */}
        <main className="z-0 h-screen-nav overflow-y-scroll">
          <div className="pt-6 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

//TODO: Temporary logo.
function CheckmarkTitle() {
  return (
    <>
      <div>
        <Image
          width={50}
          height={50}
          src={"/tbt-checkmark.jpg"}
          alt=""
          className="rounded-md mx-auto border-2"
          layout="fixed"
        />
      </div>
      <h1 className="px-3 text-left text-white text-sm tracking-wider uppercase font-extrabold italic">
        Tutored By Teachers
      </h1>
    </>
  );
}
