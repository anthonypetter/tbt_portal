import { gql } from "@apollo/client";
import { OrganizationDetailPageQuery } from "@generated/graphql";
import { FaRegBuilding } from "react-icons/fa";
import { Breadcrumbs } from "components/Breadcrumbs";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";
import { Button } from "components/Button";
import clsx from "clsx";
import { Container } from "components/Container";
import { Badge } from "components/Badge";

OrganizationDetailPage.fragments = {
  details: gql`
    fragment OrganizationDetails on Organization {
      id
      name
      district
      subDistrict
      location
      description
    }
  `,
};

// Fill out
const tabs = [
  { name: "Engagements", href: "#", count: "4", current: true },
  { name: "Cohorts", href: "#", count: "2", current: false },
];

type Props = {
  organization: NonNullable<OrganizationDetailPageQuery["organization"]>;
};

export function OrganizationDetailPage({ organization }: Props) {
  return (
    <div>
      <Breadcrumbs
        path={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Organizations",
            href: Routes.organizations.href(),
          },
          { name: organization.name, href: "", current: true },
        ]}
      />

      <HeaderAndIcon
        title={organization.name}
        description={organization.description}
        icon={FaRegBuilding}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid lg:grid-cols-12 lg:gap-8">
        <Container padding="md" className="lg:col-span-9">
          <Tabs />

          <div className="mt-4">Tab body</div>
        </Container>

        <Container className={clsx("lg:col-span-3")} padding="none">
          <MetaSection title="Contact">
            <p className="text-gray-600 text-sm">Name: Victor M. Merino</p>
          </MetaSection>
          <MetaSection title="Metadata">
            <Badge className="text-green-800 bg-green-100">Example</Badge>
          </MetaSection>
        </Container>
      </div>
    </div>
  );
}

type HeaderAndIconProps = {
  title: string;
  description?: string | null;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
};

function HeaderAndIcon({ title, description, icon: Icon }: HeaderAndIconProps) {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        "mb-8 "
      )}
    >
      <div className="flex items-center">
        <div className="flex">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-2">
              {title}
            </h1>

            {description && (
              <p className="text-sm font-medium text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="sm:my-0 mt-4">
        <Button className="min-w-[80px]" onClick={() => console.log("edit")}>
          Edit
        </Button>
      </div>
    </div>
  );
}

function MetaSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="border-b border-gray-200 py-5 px-4 sm:px-6">
      <h2 className="text-base font-medium text-gray-900 mb-4">{title}</h2>

      {children}
    </div>
  );
}

function Tabs() {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          // defaultValue={tabs.find((tab) => tab.current).name}
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
              <a
                key={tab.name}
                href={tab.href}
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
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
