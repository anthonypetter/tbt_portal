import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
  Pending = 'PENDING'
}

export type AddOrganizationInput = {
  district?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  subDistrict?: InputMaybe<Scalars['String']>;
};

export type EditOrganizationInput = {
  district?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  subDistrict?: InputMaybe<Scalars['String']>;
};

export type InviteUserResonse = {
  __typename?: 'InviteUserResonse';
  inviteSent: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  addOrganization: Organization;
  deleteOrganization: Organization;
  editOrganization: Organization;
  inviteUser: InviteUserResonse;
};


export type MutationAddOrganizationArgs = {
  input: AddOrganizationInput;
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID'];
};


export type MutationEditOrganizationArgs = {
  input: EditOrganizationInput;
};


export type MutationInviteUserArgs = {
  email: Scalars['String'];
  role: UserRole;
};

export type Organization = {
  __typename?: 'Organization';
  district?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  subDistrict?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  currentUser?: Maybe<User>;
  organizations: Array<Organization>;
  users: Array<User>;
};

export type User = {
  __typename?: 'User';
  accountStatus: AccountStatus;
  email: Scalars['String'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  MentorTeacher = 'MENTOR_TEACHER',
  TutorTeacher = 'TUTOR_TEACHER'
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', email: string, accountStatus: AccountStatus, role: UserRole } | null };

export type AddOrganizationMutationVariables = Exact<{
  input: AddOrganizationInput;
}>;


export type AddOrganizationMutation = { __typename?: 'Mutation', addOrganization: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null } };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization: { __typename?: 'Organization', id: string } };

export type OrganizationsFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null }> };

export type OrganizationsTableFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null }> };

export type InviteUserMutationVariables = Exact<{
  email: Scalars['String'];
  role: UserRole;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'InviteUserResonse', inviteSent: boolean } };

export type UsersFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string, role: UserRole, accountStatus: AccountStatus }> };

export type OrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationsPageQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null }> };

export type UsersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPageQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string, role: UserRole, accountStatus: AccountStatus }> };

export const OrganizationsTableFragmentDoc = gql`
    fragment OrganizationsTable on Query {
  organizations {
    id
    name
    district
    subDistrict
  }
}
    `;
export const OrganizationsFragmentDoc = gql`
    fragment Organizations on Query {
  ...OrganizationsTable
}
    ${OrganizationsTableFragmentDoc}`;
export const UsersFragmentDoc = gql`
    fragment Users on Query {
  users {
    email
    role
    accountStatus
  }
}
    `;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    email
    accountStatus
    role
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const AddOrganizationDocument = gql`
    mutation AddOrganization($input: AddOrganizationInput!) {
  addOrganization(input: $input) {
    id
    name
    district
    subDistrict
  }
}
    `;
export type AddOrganizationMutationFn = Apollo.MutationFunction<AddOrganizationMutation, AddOrganizationMutationVariables>;

/**
 * __useAddOrganizationMutation__
 *
 * To run a mutation, you first call `useAddOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOrganizationMutation, { data, loading, error }] = useAddOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<AddOrganizationMutation, AddOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddOrganizationMutation, AddOrganizationMutationVariables>(AddOrganizationDocument, options);
      }
export type AddOrganizationMutationHookResult = ReturnType<typeof useAddOrganizationMutation>;
export type AddOrganizationMutationResult = Apollo.MutationResult<AddOrganizationMutation>;
export type AddOrganizationMutationOptions = Apollo.BaseMutationOptions<AddOrganizationMutation, AddOrganizationMutationVariables>;
export const DeleteOrganizationDocument = gql`
    mutation DeleteOrganization($id: ID!) {
  deleteOrganization(id: $id) {
    id
  }
}
    `;
export type DeleteOrganizationMutationFn = Apollo.MutationFunction<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;

/**
 * __useDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationMutation, { data, loading, error }] = useDeleteOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>(DeleteOrganizationDocument, options);
      }
export type DeleteOrganizationMutationHookResult = ReturnType<typeof useDeleteOrganizationMutation>;
export type DeleteOrganizationMutationResult = Apollo.MutationResult<DeleteOrganizationMutation>;
export type DeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
export const InviteUserDocument = gql`
    mutation InviteUser($email: String!, $role: UserRole!) {
  inviteUser(email: $email, role: $role) {
    inviteSent
  }
}
    `;
export type InviteUserMutationFn = Apollo.MutationFunction<InviteUserMutation, InviteUserMutationVariables>;

/**
 * __useInviteUserMutation__
 *
 * To run a mutation, you first call `useInviteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteUserMutation, { data, loading, error }] = useInviteUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useInviteUserMutation(baseOptions?: Apollo.MutationHookOptions<InviteUserMutation, InviteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteUserMutation, InviteUserMutationVariables>(InviteUserDocument, options);
      }
export type InviteUserMutationHookResult = ReturnType<typeof useInviteUserMutation>;
export type InviteUserMutationResult = Apollo.MutationResult<InviteUserMutation>;
export type InviteUserMutationOptions = Apollo.BaseMutationOptions<InviteUserMutation, InviteUserMutationVariables>;
export const OrganizationsPageDocument = gql`
    query OrganizationsPage {
  ...Organizations
}
    ${OrganizationsFragmentDoc}`;

/**
 * __useOrganizationsPageQuery__
 *
 * To run a query within a React component, call `useOrganizationsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationsPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationsPageQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationsPageQuery, OrganizationsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationsPageQuery, OrganizationsPageQueryVariables>(OrganizationsPageDocument, options);
      }
export function useOrganizationsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationsPageQuery, OrganizationsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationsPageQuery, OrganizationsPageQueryVariables>(OrganizationsPageDocument, options);
        }
export type OrganizationsPageQueryHookResult = ReturnType<typeof useOrganizationsPageQuery>;
export type OrganizationsPageLazyQueryHookResult = ReturnType<typeof useOrganizationsPageLazyQuery>;
export type OrganizationsPageQueryResult = Apollo.QueryResult<OrganizationsPageQuery, OrganizationsPageQueryVariables>;
export const UsersPageDocument = gql`
    query UsersPage {
  ...Users
}
    ${UsersFragmentDoc}`;

/**
 * __useUsersPageQuery__
 *
 * To run a query within a React component, call `useUsersPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersPageQuery(baseOptions?: Apollo.QueryHookOptions<UsersPageQuery, UsersPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersPageQuery, UsersPageQueryVariables>(UsersPageDocument, options);
      }
export function useUsersPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersPageQuery, UsersPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersPageQuery, UsersPageQueryVariables>(UsersPageDocument, options);
        }
export type UsersPageQueryHookResult = ReturnType<typeof useUsersPageQuery>;
export type UsersPageLazyQueryHookResult = ReturnType<typeof useUsersPageLazyQuery>;
export type UsersPageQueryResult = Apollo.QueryResult<UsersPageQuery, UsersPageQueryVariables>;