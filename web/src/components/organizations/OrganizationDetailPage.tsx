import { gql } from "@apollo/client";
import { OrganizationDetailPageQuery } from "@generated/graphql";
import { FaRegBuilding } from "react-icons/fa";
import { Breadcrumbs } from "components/Breadcrumbs";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";
import { Button } from "components/Button";
import clsx from "clsx";

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

      <div className="border-b border-gray-200 shadow overflow-hidden sm:rounded-lg">
        <div className="bg-white">hello</div>
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
        <div
          className={clsx(
            "flex flex-shrink-0 items-center justify-center",
            "w-16 h-16 sm:w-28 sm:h-28",
            "bg-white rounded-xl shadow mr-8"
          )}
        >
          <Icon
            className="w-8 h-8 sm:w-14 sm:h-14 text-gray-700"
            aria-hidden="true"
          />
        </div>

        <div className="flex">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
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
