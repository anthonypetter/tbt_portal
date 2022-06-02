import { gql } from "@apollo/client";
import { FlatEngagementsPageQuery } from "@generated/graphql";
import { PageHeader } from "components/PageHeader";
import { breadcrumbs } from "@utils/breadcrumbs";
import { FlatEngagementsTable } from "./FlatEngagementsTable";

FlatEngagementsPage.fragments = {
  engagements: gql`
    fragment FlatEngagements on Query {
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
          startDate
          endDate
        }
        staffAssignments {
          user {
            id
            fullName
            email
          }
          role
        }
      }
    }
  `,
};

type Props = {
  engagements: NonNullable<FlatEngagementsPageQuery["engagements"]>;
};

export function FlatEngagementsPage({ engagements }: Props) {
  return (
    <div>
      <PageHeader
        title="Engagements"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.engagements({ current: true }),
        ]}
      />

      <FlatEngagementsTable
        engagements={engagements}
        selectedEngagement={null}
      />
    </div>
  );
}
