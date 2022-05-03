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

export type InviteUserResonse = {
  __typename?: 'InviteUserResonse';
  inviteSent: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  inviteUser: InviteUserResonse;
};


export type MutationInviteUserArgs = {
  email: Scalars['String'];
  role: UserRole;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  currentUser?: Maybe<User>;
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

export type InviteUserMutationVariables = Exact<{
  email: Scalars['String'];
  role: UserRole;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'InviteUserResonse', inviteSent: boolean } };

export type UsersFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string, role: UserRole, accountStatus: AccountStatus }> };

export type GetUsersTestQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersTestQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string, role: UserRole, accountStatus: AccountStatus }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', email: string, accountStatus: AccountStatus, role: UserRole } | null };

export type UsersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPageQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string, role: UserRole, accountStatus: AccountStatus }> };

export const UsersFragmentDoc = gql`
    fragment Users on Query {
  users {
    email
    role
    accountStatus
  }
}
    `;
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
export const GetUsersTestDocument = gql`
    query GetUsersTest {
  users {
    email
    role
    accountStatus
  }
}
    `;

/**
 * __useGetUsersTestQuery__
 *
 * To run a query within a React component, call `useGetUsersTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersTestQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersTestQuery, GetUsersTestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersTestQuery, GetUsersTestQueryVariables>(GetUsersTestDocument, options);
      }
export function useGetUsersTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersTestQuery, GetUsersTestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersTestQuery, GetUsersTestQueryVariables>(GetUsersTestDocument, options);
        }
export type GetUsersTestQueryHookResult = ReturnType<typeof useGetUsersTestQuery>;
export type GetUsersTestLazyQueryHookResult = ReturnType<typeof useGetUsersTestLazyQuery>;
export type GetUsersTestQueryResult = Apollo.QueryResult<GetUsersTestQuery, GetUsersTestQueryVariables>;
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