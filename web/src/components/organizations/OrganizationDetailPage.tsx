import { gql } from "@apollo/client";
import { OrganizationDetailPageQuery } from "@generated/graphql";
import { FaRegBuilding } from "react-icons/fa";
import { Breadcrumbs } from "components/Breadcrumbs";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";

OrganizationDetailPage.fragments = {
  details: gql`
    fragment OrganizationDetails on Organization {
      id
      name
      district
      subDistrict
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
        description={"some description"}
        icon={FaRegBuilding}
      />
    </div>
  );
}

type HeaderAndIconProps = {
  title: string;
  description: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
};

function HeaderAndIcon({ title, description, icon: Icon }: HeaderAndIconProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="flex flex-shrink-0 items-center justify-center w-28 h-28 bg-white rounded-xl shadow mr-8">
        <Icon className="w-14 h-14" aria-hidden="true" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm font-medium text-gray-500">{description}</p>
      </div>
    </div>
  );
}
