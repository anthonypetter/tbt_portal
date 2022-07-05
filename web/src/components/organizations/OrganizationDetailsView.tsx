import { gql } from "@apollo/client";
import { OrganizationDetailsView_OrganizationFragment } from "@generated/graphql";
import { Details } from "components/Details";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";

OrganizationDetailsView.fragments = {
  organization: gql`
    fragment OrganizationDetailsView_Organization on Organization {
      id
      name
      createdAt
      location
      description
      district
      subDistrict
    }
  `,
};

type Props = {
  organization: OrganizationDetailsView_OrganizationFragment;
};

export function OrganizationDetailsView({ organization }: Props) {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <Details>
        <Details.Line className="mt-4">
          <Details.Term>Organization ID</Details.Term>
          <Details.Detail>{organization.id}</Details.Detail>
        </Details.Line>
        <Details.Line>
          <Details.Term>Name</Details.Term>
          <Details.Detail>{organization.name}</Details.Detail>
        </Details.Line>
        <Details.Line>
          <Details.Term>Description</Details.Term>
          <Details.Detail>{organization.description}</Details.Detail>
        </Details.Line>
        <Details.Line>
          <Details.Term>Created</Details.Term>
          <Details.Detail>
            {new Date(organization.createdAt).toLocaleString()}
          </Details.Detail>
        </Details.Line>
        <Details.Line>
          <Details.Term>Location</Details.Term>
          <Details.Detail>{organization.location}</Details.Detail>
        </Details.Line>
        <Details.Line>
          <Details.Term>District</Details.Term>
          <Details.Detail>{organization.district}</Details.Detail>
        </Details.Line>
        <Details.Line>
          <Details.Term>Sub district</Details.Term>
          <Details.Detail>{organization.subDistrict}</Details.Detail>
        </Details.Line>
      </Details>
    </ErrorBoundary>
  );
}
