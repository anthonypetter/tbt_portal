import { useEffect, useState } from "react";
import { Button } from "../Button";
import { InviteUserModal } from "./InviteUserModal";
import { SearchUsersForUsersPageQuery } from "@generated/graphql";
import { gql, useLazyQuery } from "@apollo/client";
import { triggerSuccessToast, triggerErrorToast } from "../Toast";
import { UsersTable } from "./UsersTable";
import { Routes } from "@utils/routes";
import { PageHeader } from "components/PageHeader";
import { HomeIcon } from "@heroicons/react/solid";
import { Input } from "components/Input";
import { SearchIcon } from "@heroicons/react/solid";
import { Spinner } from "components/Spinner";
import { useDebounce } from "use-debounce";

const MIN_QUERY_LENGTH = 3;

type Props = {
  users: SearchUsersForUsersPageQuery['searchUsers']['results'];
  refetchUsers: () => void;
};

UsersPage.fragments = {
  users: gql`
    fragment UsersPage on Query {
      ...UsersTable
    }
    ${UsersTable.fragments.users}
  `,
};

const SEARCH_USER = gql`
query SearchUsersForUsersPage($query: String!) {
  searchUsers(query: $query) {
    count
    results {
      id
      fullName
      email
      role
      accountStatus
      inviteSentAt
    }
  }
}`;

export function UsersPage({ users, refetchUsers }: Props) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultsMode, setSearchResultsMode] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUsersForUsersPageQuery['searchUsers']['results']>([]);

  const { loading } = useUsersSearch(searchQuery, {
    onCompleted: (results) => {
      setSearchResults(results);
      setSearchResultsMode(true);
    },
  });

  return (
    <>
      <PageHeader
        title="Users"
        breadcrumbs={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Users",
            href: Routes.users.href(),
            current: true,
          },
        ]}
      />

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowInviteModal(true)}>Invite User</Button>
      </div>

      <div className="flex justify-between mb-6">
        <Input
          className="flex-1 max-w-lg"
          id="users-search"
          placeholder="Search Users"
          leftIcon={SearchIcon}
          value={searchQuery}
          type="search"
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <div className="w-12 ml-1">
          {loading && <Spinner color="border-blue-500" />}
        </div>
        <button
          className="text-blue-500"
          onClick={() => {
            setSearchQuery("");
            setSearchResultsMode(false);
            refetchUsers();
          }}
        >
          Reset
        </button>
      </div>

      <div className="mb-4 lg:mb-0">
        <UsersTable users={searchResultsMode ? searchResults : users} />
      </div>

      <InviteUserModal
        show={showInviteModal}
        onCancel={() => setShowInviteModal(false)}
        onSuccess={() => {
          refetchUsers();
          setShowInviteModal(false);
          triggerSuccessToast({ message: "User successfully invited!" });
        }}
      />
    </>
  );
}

const useUsersSearch = (
  query: string,
  options: {
    onCompleted: (results: SearchUsersForUsersPageQuery['searchUsers']['results']) => void
  }
) => {
  const [debouncedQuery] = useDebounce(query, 300)

  const [searchUsers, { loading, data, error }] =
    useLazyQuery<SearchUsersForUsersPageQuery>(SEARCH_USER, {
      variables: { query },
      fetchPolicy: "no-cache",
      onCompleted: ({ searchUsers }) => {
        options.onCompleted(searchUsers.results)
      },
      onError: (error) => {
        triggerErrorToast({
          message: "Something went wrong with this search.",
          sub: error.message,
        })
      }
    })

  useEffect(() => {
    if (debouncedQuery.length >= MIN_QUERY_LENGTH) {
      searchUsers({
        variables: { query: debouncedQuery }
      })
    }
  }, [debouncedQuery, searchUsers]);

  return { loading, error, results: data?.searchUsers.results };
}