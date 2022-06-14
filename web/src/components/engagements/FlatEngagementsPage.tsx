import { gql } from "@apollo/client";
import { FlatEngagementsPageFragment } from "@generated/graphql";
import { PageHeader } from "components/PageHeader";
import { breadcrumbs } from "@utils/breadcrumbs";
import { FlatEngagementsTable } from "./FlatEngagementsTable";

FlatEngagementsPage.fragments = {
  engagements: gql`
    fragment FlatEngagementsPage on Query {
      ...FlatEngagementsTable
    }
    ${FlatEngagementsTable.fragments.engagements}
  `,
};

type Props = {
  engagements: NonNullable<FlatEngagementsPageFragment["engagements"]>;
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
