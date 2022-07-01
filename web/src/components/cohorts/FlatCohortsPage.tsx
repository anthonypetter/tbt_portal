import { gql, useLazyQuery } from "@apollo/client";
import {
  FlatCohortsPage_CohortsFragment,
  SearchCohortsQuery,
} from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/solid";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { Input } from "components/Input";
import { PageHeader } from "components/PageHeader";
import { Spinner } from "components/Spinner";
import { triggerErrorToast } from "components/Toast";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { FlatCohortsTable } from "./FlatCohortsTable";

const MIN_QUERY_LENGTH = 1;

FlatCohortsPage.fragments = {
  cohorts: gql`
    fragment FlatCohortsPage_Cohorts on Query {
      cohorts {
        ...FlatCohortsTable_Cohort
      }
    }
    ${FlatCohortsTable.fragments.cohort}
  `,
};

const SEARCH_COHORTS = gql`
  query SearchCohorts($query: String!) {
    searchCohorts(query: $query) {
      count
      results {
        ...FlatCohortsTable_Cohort
      }
    }
  }
  ${FlatCohortsTable.fragments.cohort}
`;

type Props = {
  cohorts: NonNullable<FlatCohortsPage_CohortsFragment["cohorts"]>;
  refetch: () => void;
};

export type QueryAllCohorts = NonNullable<
  FlatCohortsPage_CohortsFragment["cohorts"]
>[number];

export function FlatCohortsPage({ cohorts, refetch }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultsMode, setSearchResultsMode] = useState(false);
  const [searchResults, setSearchResults] = useState<
    SearchCohortsQuery["searchCohorts"]["results"]
  >([]);

  const { loading } = useCohortSearch(searchQuery, {
    onCompleted: (results) => {
      setSearchResults(results);
      setSearchResultsMode(true);
    },
  });

  return (
    <>
      <PageHeader
        title="Cohorts"
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href(), current: true },
        ]}
      />

      <div className="flex my-4 items-center justify-between mt-8">
        <div className="flex flex-1 max-w-lg items-center">
          <Input
            className="flex-1"
            id="engagements-search"
            placeholder="Search Engagements"
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

      <div className="mb-4 lg:mb-0 mt-8">
        <FlatCohortsTable
          cohorts={searchResultsMode ? searchResults : cohorts}
        />
      </div>
    </>
  );
}

function useCohortSearch(
  query: string,
  options: {
    onCompleted: (
      results: SearchCohortsQuery["searchCohorts"]["results"]
    ) => void;
  }
) {
  const [debouncedQuery] = useDebounce(query, 300);

  const [searchCohorts, { loading, data, error }] =
    useLazyQuery<SearchCohortsQuery>(SEARCH_COHORTS, {
      variables: { query },
      fetchPolicy: "no-cache",
      onCompleted: ({ searchCohorts }) =>
        options.onCompleted(searchCohorts.results),
      onError: (error) =>
        triggerErrorToast({
          message: "Something went wrong with this search.",
          sub: error.message,
        }),
    });

  useEffect(() => {
    if (debouncedQuery.length > MIN_QUERY_LENGTH) {
      searchCohorts({ variables: { query: debouncedQuery } });
    }
  }, [debouncedQuery, searchCohorts]);

  return { loading, error, results: data?.searchCohorts.results };
}
