import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  CalendarIcon,
  HomeIcon,
  MenuAlt2Icon,
  XIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Routes } from "@utils/routes";
import { FaRegBuilding, FaGraduationCap } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { MdWorkspacesOutline } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { BiVideoRecording } from "react-icons/bi";
import { RiSignalTowerFill } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./auth/AuthProvider";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/outline";
import { useTheme } from "./ThemeProvider";
import { RoleText } from "./RoleText";
import { UserRole } from "@generated/graphql";
import { fromJust } from "@utils/types";
import sortBy from "lodash/sortBy";

type SidebarLink = {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  current: boolean;
  order: number;
  disabled: boolean;
};

function getNavigation(role: UserRole, currentPathname: string) {
  const commonLinks: SidebarLink[] = [
    {
      name: "Home",
      href: Routes.home.href(),
      icon: HomeIcon,
      current: Routes.home.path() === currentPathname,
      order: 10,
      disabled: true,
    },
  ];

  const commonTeacherLinks: SidebarLink[] = [
    {
      name: "My Schedule",
      href: Routes.mySchedule.href(),
      icon: CalendarIcon,
      current: Routes.mySchedule.path() === currentPathname,
      order: 20,
      disabled: false,
    },
  ];

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
      current: Routes.cohorts.path() === currentPathname,
      order: 60,
      disabled: false,
    },
    {
      name: "Teachers",
      href: Routes.teachers.href(),
      icon: FaGraduationCap,
      current: Routes.teachers.path() === currentPathname,
      order: 70,
      disabled: false,
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
      return sortBy([...commonLinks, ...adminOnlyLinks], (n) => n.order).filter(
        (link) => link.disabled === false
      );

    case UserRole.MentorTeacher:
      return [...commonLinks, ...commonTeacherLinks].filter(
        (link) => link.disabled === false
      );

    case UserRole.TutorTeacher:
      return [...commonLinks, ...commonTeacherLinks].filter(
        (link) => link.disabled === false
      );

    default:
      break;
  }

  return [];
}

// TODO: update
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
];

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
                    <XIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
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

        {/* Top bar container */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">

          {/* Mobile Hamburger button */}
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Top bar */}
          <div className="flex-1 px-4 flex justify-between">
            {/* Search input */}
            <div className="flex-1 flex">
              <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>

            {/* Utility Buttons */}
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <AvatarDropdown />
            </div>
          </div>
        </div>

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

function AvatarDropdown() {
  const auth = useAuth();

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          <span className="sr-only">Open user menu</span>
          <UserCircleIcon className="h-8 w-8 rounded-full" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="divide-y divide-gray-200 origin-top-right absolute right-0 mt-2 w-100 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          {auth.user && (
            <div className="py-1">
              <Menu.Item key="role">
                <div className="px-4 py-2">
                  <div className="flex items-center">
                    <UserCircleIcon
                      className="h-10 w-10 rounded-full mr-1"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-xs text-gray-700 font-bold">
                        {auth.user.email}
                      </div>
                      <RoleText
                        role={auth.user.role}
                        className="text-xs text-gray-700 font-light"
                      />
                    </div>
                  </div>
                </div>
              </Menu.Item>
            </div>
          )}

          <div className="py-1">
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    className={clsx(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    {item.name}
                  </a>
                )}
              </Menu.Item>
            ))}

            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => auth.signOut()}
                  className={clsx(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-gray-700 text-sm cursor-pointer"
                  )}
                >
                  Sign out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
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
