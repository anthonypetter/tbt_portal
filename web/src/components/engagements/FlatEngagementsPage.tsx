import { gql, useLazyQuery } from "@apollo/client";
import {
  FlatEngagementsTableEngagementFragment,
  SearchEngagementsQuery,
} from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/solid";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Input } from "components/Input";
import { PageHeader } from "components/PageHeader";
import { Spinner } from "components/Spinner";
import { triggerErrorToast } from "components/Toast";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { FlatEngagementsTable } from "./FlatEngagementsTable";

const MIN_QUERY_LENGTH = 3;

FlatEngagementsPage.fragments = {
  engagements: gql`
    fragment FlatEngagementsPage on Query {
      engagements {
        ...FlatEngagementsTableEngagement
      }
    }
    ${FlatEngagementsTable.fragments.engagement}
  `,
};

const SEARCH_ENGAGEMENTS = gql`
  query SearchEngagements($query: String!) {
    searchEngagements(query: $query) {
      count
      results {
        ...FlatEngagementsTableEngagement
      }
    }
  }
  ${FlatEngagementsTable.fragments.engagement}
`;

type Props = {
  engagements: FlatEngagementsTableEngagementFragment[];
  refetch: () => void;
};

export function FlatEngagementsPage({ engagements, refetch }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultsMode, setSearchResultsMode] = useState(false);
  const { results, loading } = useEngagementsSearch(searchQuery);

  useEffect(() => {
    if (searchQuery.length >= MIN_QUERY_LENGTH && !loading) {
      setSearchResultsMode(true);
    }
  }, [searchQuery, loading]);

  return (
    <div>
      <PageHeader
        title="Engagements"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.engagements({ current: true }),
        ]}
      />

      <div className="flex my-4 items-center justify-between">
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

      <FlatEngagementsTable
        engagements={searchResultsMode && results ? results : engagements}
        selectedEngagement={null}
      />
    </div>
  );
}

function useEngagementsSearch(query: string) {
  const [debouncedQuery] = useDebounce(query, 300);

  const [searchEngagements, { loading, data }] =
    useLazyQuery<SearchEngagementsQuery>(SEARCH_ENGAGEMENTS, {
      variables: { query },
      fetchPolicy: "no-cache",
      onError: (error) =>
        triggerErrorToast({
          message: "Something went wrong with this search.",
          sub: error.message,
        }),
    });

  useEffect(() => {
    if (debouncedQuery.length >= MIN_QUERY_LENGTH) {
      searchEngagements({ variables: { query: debouncedQuery } });
    }
  }, [debouncedQuery, searchEngagements]);

  return { loading, results: data?.searchEngagements.results };
}
