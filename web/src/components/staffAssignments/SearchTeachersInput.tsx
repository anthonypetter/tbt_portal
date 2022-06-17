import { useState, useEffect, useMemo } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { SearchUsersQuery } from "@generated/graphql";
import { SearchItem, SearchCombobox } from "./SearchCombobox";
import { AddTeacherButton } from "./AddTeacherButton";
import { fromJust } from "@utils/types";
import { useDebounce } from "use-debounce";
import { Assignment } from "./types";

const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      count
      results {
        id
        fullName
        email
      }
    }
  }
`;

export type SearchUsersResult =
  SearchUsersQuery["searchUsers"]["results"][number];

export type TeacherSelection = {
  userId: string;
  fullName: string;
  email: string;
};

type Props = {
  onSelect: (teacher: TeacherSelection | null) => void;
  onClickAdd: (
    teacher: TeacherSelection | null,
    assignment: Assignment
  ) => void;
  options: Assignment[];
};

export function SearchTeachersInput({ onSelect, onClickAdd, options }: Props) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [teacherSelection, setTeacherSelection] =
    useState<TeacherSelection | null>(null);

  const [searchUsers, { data, loading }] = useLazyQuery<SearchUsersQuery>(
    SEARCH_USERS,
    {
      variables: { query },
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (debouncedQuery.length > 3) {
      searchUsers({ variables: { query: debouncedQuery } });
    }
  }, [debouncedQuery, searchUsers]);

  let results: SearchUsersResult[] = [];
  if (data?.searchUsers.__typename === "UsersSearchResults") {
    results = data.searchUsers.results;
  }

  const selection = useMemo(() => {
    if (!teacherSelection) {
      return null;
    }

    return {
      id: teacherSelection.userId,
      value: teacherSelection.fullName,
      subValue: teacherSelection.email,
    };
  }, [teacherSelection]);

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700"></span>

      <label
        htmlFor={"search-users-combobox"}
        className="block text-sm font-medium text-gray-700"
      >
        Add Teachers
      </label>

      <div className="flex">
        <div className="w-full">
          <SearchCombobox
            id="search-teachers-combobox"
            loading={loading}
            query={query}
            onChange={(searchString: string) => setQuery(searchString)}
            results={results.map((r) => toSearchItem(r))}
            selection={selection}
            onSelect={(item) => {
              if (!item) {
                setTeacherSelection(null);
                onSelect(null);
                return;
              }

              const { id, fullName, email } = fromJust(
                results.find((r) => r.id === item.id)
              );

              setTeacherSelection({ userId: id, fullName, email });
              onSelect({ userId: id, fullName, email });
            }}
          />
        </div>

        <div className="mt-1 ml-3">
          <AddTeacherButton
            onAdd={(assignment) => onClickAdd(teacherSelection, assignment)}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}

function toSearchItem(result: SearchUsersResult): SearchItem {
  return { id: result.id, value: result.fullName, subValue: result.email };
}
