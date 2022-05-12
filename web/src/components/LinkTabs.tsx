import clsx from "clsx";
import Link from "next/link";

type Tab = {
  name: string;
  href: string;
  count?: number;
  current: boolean;
};

type Props = {
  tabs: Tab[];
};

export function LinkTabs({ tabs }: Props) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* TODO: Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link key={tab.name} href={tab.href}>
                <a
                  className={clsx(
                    tab.current
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  )}
                >
                  {tab.name}
                  {tab.count ? (
                    <span
                      className={clsx(
                        tab.current
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-900",
                        "hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
