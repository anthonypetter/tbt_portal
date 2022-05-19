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
  Date: any;
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

export enum AssignmentRole {
  GeneralTeacher = 'GENERAL_TEACHER',
  MentorTeacher = 'MENTOR_TEACHER',
  SubstituteTeacher = 'SUBSTITUTE_TEACHER'
}

export type Cohort = {
  __typename?: 'Cohort';
  createdAt: Scalars['Date'];
  endDate?: Maybe<Scalars['Date']>;
  engagementId: Scalars['ID'];
  exempt?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['String']>;
  hostKey?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  meetingRoom?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  staffAssignments: Array<StaffAssignment>;
  startDate?: Maybe<Scalars['Date']>;
};

export type EditEngagementInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  newStaffAssignments?: InputMaybe<Array<NewStaffAssignment>>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type EditOrganizationInput = {
  description?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  subDistrict?: InputMaybe<Scalars['String']>;
};

export type Engagement = {
  __typename?: 'Engagement';
  cohorts: Array<Cohort>;
  createdAt: Scalars['Date'];
  endDate?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  organizationId: Scalars['ID'];
  staffAssignments: Array<StaffAssignment>;
  startDate?: Maybe<Scalars['Date']>;
};

export type InviteUserInput = {
  email: Scalars['String'];
  fullName: Scalars['String'];
  role: UserRole;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  addOrganization: Organization;
  deleteOrganization: Organization;
  editEngagement: Engagement;
  editOrganization: Organization;
  inviteUser: User;
};


export type MutationAddOrganizationArgs = {
  input: AddOrganizationInput;
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID'];
};


export type MutationEditEngagementArgs = {
  input: EditEngagementInput;
};


export type MutationEditOrganizationArgs = {
  input: EditOrganizationInput;
};


export type MutationInviteUserArgs = {
  input: InviteUserInput;
};

export type NewStaffAssignment = {
  assignmentRole: AssignmentRole;
  userId: Scalars['ID'];
};

export type Organization = {
  __typename?: 'Organization';
  description?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  engagements: Array<Engagement>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  subDistrict?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  cohorts: Array<Cohort>;
  currentUser?: Maybe<User>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  searchUsers: SearchResults;
  users: Array<User>;
};


export type QueryCohortsArgs = {
  organizationId: Scalars['ID'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String'];
};

export type SearchResults = {
  __typename?: 'SearchResults';
  count: Scalars['Int'];
  results: Array<User>;
};

export type StaffAssignment = {
  __typename?: 'StaffAssignment';
  assignmentRole: AssignmentRole;
  user: User;
};

export type User = {
  __typename?: 'User';
  accountStatus: AccountStatus;
  email: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['String'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  MentorTeacher = 'MENTOR_TEACHER',
  TutorTeacher = 'TUTOR_TEACHER'
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', email: string, accountStatus: AccountStatus, role: UserRole } | null };

export type CohortsViewListFFragment = { __typename?: 'Organization', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null }> }> };

export type EditEngagementMutationVariables = Exact<{
  input: EditEngagementInput;
}>;


export type EditEngagementMutation = { __typename?: 'Mutation', editEngagement: { __typename?: 'Engagement', id: string, name: string } };

export type EngagementsViewListFFragment = { __typename?: 'Organization', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'StaffAssignment', assignmentRole: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type AddOrganizationMutationVariables = Exact<{
  input: AddOrganizationInput;
}>;


export type AddOrganizationMutation = { __typename?: 'Mutation', addOrganization: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null } };

export type NewOrgFragment = { __typename: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null } };

export type EditOrganizationMutationVariables = Exact<{
  input: EditOrganizationInput;
}>;


export type EditOrganizationMutation = { __typename?: 'Mutation', editOrganization: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null } };

export type EngagementsViewFFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'StaffAssignment', assignmentRole: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type CohortsViewFFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null }> }> };

export type OrganizationsFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null }> };

export type OrganizationsTableFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null }> };

export type SearchUsersQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'SearchResults', count: number, results: Array<{ __typename?: 'User', id: string, fullName: string, email: string }> } };

export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'User', id: string } };

export type UsersPageFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus }> };

export type UsersTableFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus }> };

export type OrgDetailPageCohortsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageCohortsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null }> }> } | null };

export type OrgDetailPageEngagementsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageEngagementsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'StaffAssignment', assignmentRole: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> } | null };

export type OrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationsPageQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null }> };

export type UsersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPageQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus }> };

export const NewOrgFragmentDoc = gql`
    fragment NewOrg on Organization {
  id
  name
  district
  subDistrict
  __typename
}
    `;
export const EngagementsViewListFFragmentDoc = gql`
    fragment EngagementsViewListF on Organization {
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
      assignmentRole
    }
  }
}
    `;
export const EngagementsViewFFragmentDoc = gql`
    fragment EngagementsViewF on Organization {
  id
  name
  district
  subDistrict
  location
  description
  ...EngagementsViewListF
}
    ${EngagementsViewListFFragmentDoc}`;
export const CohortsViewListFFragmentDoc = gql`
    fragment CohortsViewListF on Organization {
  engagements {
    id
    name
    startDate
    endDate
    organizationId
    cohorts {
      id
      createdAt
      name
      grade
      meetingRoom
      hostKey
      exempt
      startDate
      endDate
    }
  }
}
    `;
export const CohortsViewFFragmentDoc = gql`
    fragment CohortsViewF on Organization {
  id
  name
  district
  subDistrict
  location
  description
  ...CohortsViewListF
}
    ${CohortsViewListFFragmentDoc}`;
export const OrganizationsTableFragmentDoc = gql`
    fragment OrganizationsTable on Query {
  organizations {
    id
    name
    district
    subDistrict
    location
    description
  }
}
    `;
export const OrganizationsFragmentDoc = gql`
    fragment Organizations on Query {
  ...OrganizationsTable
}
    ${OrganizationsTableFragmentDoc}`;
export const UsersTableFragmentDoc = gql`
    fragment UsersTable on Query {
  users {
    id
    fullName
    email
    role
    accountStatus
  }
}
    `;
export const UsersPageFragmentDoc = gql`
    fragment UsersPage on Query {
  ...UsersTable
}
    ${UsersTableFragmentDoc}`;
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
export const EditEngagementDocument = gql`
    mutation EditEngagement($input: EditEngagementInput!) {
  editEngagement(input: $input) {
    id
    name
  }
}
    `;
export type EditEngagementMutationFn = Apollo.MutationFunction<EditEngagementMutation, EditEngagementMutationVariables>;

/**
 * __useEditEngagementMutation__
 *
 * To run a mutation, you first call `useEditEngagementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEngagementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEngagementMutation, { data, loading, error }] = useEditEngagementMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditEngagementMutation(baseOptions?: Apollo.MutationHookOptions<EditEngagementMutation, EditEngagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditEngagementMutation, EditEngagementMutationVariables>(EditEngagementDocument, options);
      }
export type EditEngagementMutationHookResult = ReturnType<typeof useEditEngagementMutation>;
export type EditEngagementMutationResult = Apollo.MutationResult<EditEngagementMutation>;
export type EditEngagementMutationOptions = Apollo.BaseMutationOptions<EditEngagementMutation, EditEngagementMutationVariables>;
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
    name
    district
    subDistrict
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
export const EditOrganizationDocument = gql`
    mutation EditOrganization($input: EditOrganizationInput!) {
  editOrganization(input: $input) {
    id
    name
    district
    subDistrict
  }
}
    `;
export type EditOrganizationMutationFn = Apollo.MutationFunction<EditOrganizationMutation, EditOrganizationMutationVariables>;

/**
 * __useEditOrganizationMutation__
 *
 * To run a mutation, you first call `useEditOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editOrganizationMutation, { data, loading, error }] = useEditOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<EditOrganizationMutation, EditOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditOrganizationMutation, EditOrganizationMutationVariables>(EditOrganizationDocument, options);
      }
export type EditOrganizationMutationHookResult = ReturnType<typeof useEditOrganizationMutation>;
export type EditOrganizationMutationResult = Apollo.MutationResult<EditOrganizationMutation>;
export type EditOrganizationMutationOptions = Apollo.BaseMutationOptions<EditOrganizationMutation, EditOrganizationMutationVariables>;
export const SearchUsersDocument = gql`
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

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export const InviteUserDocument = gql`
    mutation InviteUser($input: InviteUserInput!) {
  inviteUser(input: $input) {
    id
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
 *      input: // value for 'input'
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
export const OrgDetailPageCohortsDocument = gql`
    query OrgDetailPageCohorts($id: ID!) {
  organization(id: $id) {
    ...CohortsViewF
  }
}
    ${CohortsViewFFragmentDoc}`;

/**
 * __useOrgDetailPageCohortsQuery__
 *
 * To run a query within a React component, call `useOrgDetailPageCohortsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgDetailPageCohortsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgDetailPageCohortsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrgDetailPageCohortsQuery(baseOptions: Apollo.QueryHookOptions<OrgDetailPageCohortsQuery, OrgDetailPageCohortsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrgDetailPageCohortsQuery, OrgDetailPageCohortsQueryVariables>(OrgDetailPageCohortsDocument, options);
      }
export function useOrgDetailPageCohortsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrgDetailPageCohortsQuery, OrgDetailPageCohortsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrgDetailPageCohortsQuery, OrgDetailPageCohortsQueryVariables>(OrgDetailPageCohortsDocument, options);
        }
export type OrgDetailPageCohortsQueryHookResult = ReturnType<typeof useOrgDetailPageCohortsQuery>;
export type OrgDetailPageCohortsLazyQueryHookResult = ReturnType<typeof useOrgDetailPageCohortsLazyQuery>;
export type OrgDetailPageCohortsQueryResult = Apollo.QueryResult<OrgDetailPageCohortsQuery, OrgDetailPageCohortsQueryVariables>;
export const OrgDetailPageEngagementsDocument = gql`
    query OrgDetailPageEngagements($id: ID!) {
  organization(id: $id) {
    ...EngagementsViewF
  }
}
    ${EngagementsViewFFragmentDoc}`;

/**
 * __useOrgDetailPageEngagementsQuery__
 *
 * To run a query within a React component, call `useOrgDetailPageEngagementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgDetailPageEngagementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgDetailPageEngagementsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrgDetailPageEngagementsQuery(baseOptions: Apollo.QueryHookOptions<OrgDetailPageEngagementsQuery, OrgDetailPageEngagementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrgDetailPageEngagementsQuery, OrgDetailPageEngagementsQueryVariables>(OrgDetailPageEngagementsDocument, options);
      }
export function useOrgDetailPageEngagementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrgDetailPageEngagementsQuery, OrgDetailPageEngagementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrgDetailPageEngagementsQuery, OrgDetailPageEngagementsQueryVariables>(OrgDetailPageEngagementsDocument, options);
        }
export type OrgDetailPageEngagementsQueryHookResult = ReturnType<typeof useOrgDetailPageEngagementsQuery>;
export type OrgDetailPageEngagementsLazyQueryHookResult = ReturnType<typeof useOrgDetailPageEngagementsLazyQuery>;
export type OrgDetailPageEngagementsQueryResult = Apollo.QueryResult<OrgDetailPageEngagementsQuery, OrgDetailPageEngagementsQueryVariables>;
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
  ...UsersPage
}
    ${UsersPageFragmentDoc}`;

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