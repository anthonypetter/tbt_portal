import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  MenuAlt2Icon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { useAuth } from "./auth/AuthProvider";
import { RoleText } from "./RoleText";

type Props = {
  setSidebarOpen?: (data: boolean) => void;
};

export function AuthHeader({ setSidebarOpen }: Props) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      {setSidebarOpen && (
        <button
          type="button"
          className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
      <div className="flex-1 px-4 flex justify-between">
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
                disabled
                id="search-field"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
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
  );
}

const userNavigation = [
  { name: "Your Profile", href: "#", disabled: true },
  { name: "Settings", href: "#", disabled: true },
];

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
                  <div className="flex min-w-[200px]">
                    <UserCircleIcon
                      className="h-10 w-10 rounded-full mr-1"
                      aria-hidden="true"
                    />
                    <div className="ml-1">
                      <div className="text-sm text-gray-700 font-bold py-1">
                        {auth.user.fullName}
                      </div>
                      <div className="text-xs text-gray-700 font-light">
                        {auth.user.email}
                      </div>
                      <RoleText
                        role={auth.user.role}
                        className="text-xs text-gray-700 font-light italic"
                      />
                    </div>
                  </div>
                </div>
              </Menu.Item>
            </div>
          )}

          <div className="py-1">
            {userNavigation.map((item) => (
              <Menu.Item key={item.name} disabled={item.disabled}>
                {({ active }) => (
                  <a
                    href={item.href}
                    className={clsx(
                      active ? "bg-gray-100" : "",
                      item.disabled
                        ? "text-gray-400 cursor-default"
                        : "text-gray-700",
                      "block px-4 py-2 text-sm"
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
