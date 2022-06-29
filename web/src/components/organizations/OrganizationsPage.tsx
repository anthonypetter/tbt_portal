import { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { OrganizationsPageQuery } from "@generated/graphql";
import { Button } from "components/Button";
import { OrganizationsTable } from "./OrganizationsTable";
import { AddOrgModal } from "./AddOrgModal";
import { Routes } from "@utils/routes";
import { HomeIcon, SearchIcon } from "@heroicons/react/solid";
import { PageHeader } from "components/PageHeader";
import { Input } from "components/Input";
import { useDebounce } from "use-debounce";
import { triggerErrorToast } from "components/Toast";
import { Spinner } from "components/Spinner";

const MIN_QUERY_LENGTH = 3;

OrganizationsPage.fragments = {
  organizations: gql`
    fragment Organizations on Query {
      ...OrganizationsTable
    }
    ${OrganizationsTable.fragments.organizations}
  `,
};

const SEARCH_ORGANIZATIONS = gql`
  query SearchOrganizations($query: String!) {
    searchOrganizations(query: $query) {
      count
      results {
        id,
        name,
        description,
        district,
        subDistrict
      }
    }
  }`;

type Props = {
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>;
  refetch: () => void;
};

export function OrganizationsPage({ organizations, refetch }: Props) {
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultsMode, setSearchResultsMode] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { loading } = useOrganizationsSearch(searchQuery, {
    onCompleted: (results) => {
      setSearchResults(results);
      setSearchResultsMode(true);
    },
  });

  return (
    <div>
      <PageHeader
        title="Organizations"
        breadcrumbs={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Organizations",
            href: Routes.organizations.href(),
            current: true,
          },
        ]}
      />

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowAddOrgModal(true)}>
          Add Organization
        </Button>
      </div>

      <div className="flex my-4 items-center justify-between mt-8">
        <div className="flex flex-1 max-w-lg items-center">
          <Input
            className="flex-1"
            id="organizations-search"
            placeholder="Search Organizations"
            leftIcon={SearchIcon}
            value={searchQuery}
            type="search"
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div className="w-12 ml-1">
            {loading && <Spinner color="border-blue-500" />}
          </div>
        </div>
        <button
          className="text-blue-500"
          onClick={() => {
            setSearchQuery("");
            setSearchResultsMode(false);
            refetch();
          }}
        >
          Reset
        </button>
      </div>

      <div className="mb-4 lg:mb-0">
        <OrganizationsTable organizations={searchResultsMode ? searchResults : organizations} />
      </div>

      <AddOrgModal
        show={showAddOrgModal}
        closeModal={() => setShowAddOrgModal(false)}
      />
    </div>
  );
}

function useOrganizationsSearch(
  query: string,
  options: {
    onCompleted: (results: any) => void;
  }
) {
  const [debouncedQuery] = useDebounce(query, 300);

  const [searchOrganizations, { loading, data, error }] =
    useLazyQuery<any>(SEARCH_ORGANIZATIONS, {
      variables: { query },
      fetchPolicy: "no-cache",
      onCompleted: ({ searchOrganizations }) =>
        options.onCompleted(searchOrganizations.results),
      onError: (error) =>
        triggerErrorToast({
          message: "Something went wrong with this search.",
          sub: error.message,
        }),
    });

  useEffect(() => {
    if (debouncedQuery.length >= MIN_QUERY_LENGTH) {
      searchOrganizations({ variables: { query: debouncedQuery } });
    }
  }, [debouncedQuery, searchOrganizations]);

  return { loading, error, results: data?.searchOrganizations.results };
}
