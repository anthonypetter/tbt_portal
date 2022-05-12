import { gql } from "@apollo/client";
import { OrganizationDetailPageQuery } from "@generated/graphql";
import { Breadcrumbs } from "components/Breadcrumbs";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";
import { Button } from "components/Button";
import clsx from "clsx";
import { Container } from "components/Container";
import { useRouter } from "next/router";
import { EngagementsView } from "../engagements/EngagementsView";
import { identifyTab, OrganizationTabs, Tab } from "./OrganizationTabs";

OrganizationDetailPage.fragments = {
  details: gql`
    fragment OrganizationDetails on Organization {
      id
      name
      district
      subDistrict
      location
      description
      engagements {
        id
        name
        startDate
        endDate
        organizationId
        cohorts {
          id
          name
          grade
        }
      }
    }
  `,
};

type Props = {
  organization: NonNullable<OrganizationDetailPageQuery["organization"]>;
};

export function OrganizationDetailPage({ organization }: Props) {
  const { pathname } = useRouter();
  const { tab, displayName } = identifyTab(pathname);

  return (
    <div>
      <Breadcrumbs
        path={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Organizations",
            href: Routes.organizations.href(),
          },
          {
            name: `${organization.name} ${displayName}`,
            href: Routes.org.engagements.href(organization.id),
            current: true,
          },
        ]}
      />

      <Header
        title={organization.name}
        description={organization.description}
      />

      <div className="mt-8">
        <Container padding="md">
          <OrganizationTabs organization={organization} />
          {tab === Tab.Engagements ? (
            <EngagementsView organization={organization} />
          ) : (
            <h1>Cohorts tab</h1>
          )}
        </Container>
      </div>
    </div>
  );
}

type HeaderProps = {
  title: string;
  description?: string | null;
};

function Header({ title, description }: HeaderProps) {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        "mb-8"
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
