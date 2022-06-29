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

export type AddCohortInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  engagementId: Scalars['ID'];
  grade?: InputMaybe<Scalars['String']>;
  hostKey?: InputMaybe<Scalars['String']>;
  meetingId?: InputMaybe<Scalars['String']>;
  meetingRoom?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  newStaffAssignments: Array<NewCohortStaffAssignment>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type AddEngagementInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  name: Scalars['String'];
  newStaffAssignments: Array<NewEngagementStaffAssignment>;
  organizationId: Scalars['ID'];
  startDate?: InputMaybe<Scalars['Date']>;
};

export type AddOrganizationInput = {
  description?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  subDistrict?: InputMaybe<Scalars['String']>;
};

export enum AssignmentRole {
  GeneralTeacher = 'GENERAL_TEACHER',
  MentorTeacher = 'MENTOR_TEACHER',
  SubstituteTeacher = 'SUBSTITUTE_TEACHER'
}

export enum AssignmentSubject {
  Ela = 'ELA',
  General = 'GENERAL',
  Math = 'MATH'
}

export type Cohort = {
  __typename?: 'Cohort';
  createdAt: Scalars['Date'];
  endDate?: Maybe<Scalars['Date']>;
  engagement: Engagement;
  engagementId: Scalars['ID'];
  events: Array<CohortEvent>;
  exempt?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['String']>;
  hostKey?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  meetingId?: Maybe<Scalars['String']>;
  meetingRoom?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  staffAssignments: Array<CohortStaffAssignment>;
  startDate?: Maybe<Scalars['Date']>;
};

export type CohortEvent = {
  __typename?: 'CohortEvent';
  durationMinutes: Scalars['Int'];
  startFloatingDateTime: Scalars['Date'];
  subject: AssignmentSubject;
  timeZone: Scalars['String'];
};

export type CohortStaffAssignment = {
  __typename?: 'CohortStaffAssignment';
  subject: AssignmentSubject;
  user: User;
};

export type CsvCohortStaffAssignment = {
  subject: AssignmentSubject;
  teacher: CsvCohortTeacher;
};

export type CsvCohortTeacher = {
  email: Scalars['String'];
  fullName: Scalars['String'];
};

export type CsvProcessedCohort = {
  cohortEndDate: Scalars['Date'];
  cohortName: Scalars['String'];
  cohortStartDate: Scalars['Date'];
  friday: Array<CsvSubjectSchedule>;
  googleClassroomLink?: InputMaybe<Scalars['String']>;
  grade: Scalars['String'];
  monday: Array<CsvSubjectSchedule>;
  saturday: Array<CsvSubjectSchedule>;
  staffAssignments: Array<CsvCohortStaffAssignment>;
  sunday: Array<CsvSubjectSchedule>;
  thursday: Array<CsvSubjectSchedule>;
  tuesday: Array<CsvSubjectSchedule>;
  wednesday: Array<CsvSubjectSchedule>;
};

export type CsvProcessedData = {
  cohorts: Array<CsvProcessedCohort>;
  engagementId: Scalars['ID'];
};

export type CsvSaveCountsResult = {
  __typename?: 'CsvSaveCountsResult';
  newCohortCount: Scalars['Int'];
  newTeacherCount: Scalars['Int'];
};

export type CsvSubjectSchedule = {
  endTime: Time;
  startTime: Time;
  subject: AssignmentSubject;
  timeZone: Scalars['String'];
};

export type EditCohortInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  grade?: InputMaybe<Scalars['String']>;
  hostKey?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  meetingRoom?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newStaffAssignments?: InputMaybe<Array<NewCohortStaffAssignment>>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type EditEngagementInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  newStaffAssignments?: InputMaybe<Array<NewEngagementStaffAssignment>>;
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
  organization: Organization;
  organizationId: Scalars['ID'];
  staffAssignments: Array<EngagementStaffAssignment>;
  startDate?: Maybe<Scalars['Date']>;
};

export type EngagementStaffAssignment = {
  __typename?: 'EngagementStaffAssignment';
  role: AssignmentRole;
  user: User;
};

export type EngagementsSearchResults = {
  __typename?: 'EngagementsSearchResults';
  count: Scalars['Int'];
  results: Array<Engagement>;
};

export type InviteUserInput = {
  email: Scalars['String'];
  fullName: Scalars['String'];
  role: UserRole;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  addCohort: Cohort;
  addEngagement: Engagement;
  addOrganization: Organization;
  deleteCohort: Cohort;
  deleteEngagement: Engagement;
  deleteOrganization: Organization;
  editCohort: Cohort;
  editEngagement: Engagement;
  editOrganization: Organization;
  inviteUser: User;
  saveCohortsCsvData: CsvSaveCountsResult;
};


export type MutationAddCohortArgs = {
  input: AddCohortInput;
};


export type MutationAddEngagementArgs = {
  input: AddEngagementInput;
};


export type MutationAddOrganizationArgs = {
  input: AddOrganizationInput;
};


export type MutationDeleteCohortArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEngagementArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID'];
};


export type MutationEditCohortArgs = {
  input: EditCohortInput;
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


export type MutationSaveCohortsCsvDataArgs = {
  input: CsvProcessedData;
};

export type NewCohortStaffAssignment = {
  subject: AssignmentSubject;
  userId: Scalars['ID'];
};

export type NewEngagementStaffAssignment = {
  role: AssignmentRole;
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
  cohort: Cohort;
  cohorts: Array<Cohort>;
  cohortsForOrg: Array<Cohort>;
  currentUser?: Maybe<User>;
  engagement?: Maybe<Engagement>;
  engagements: Array<Engagement>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  searchEngagements: EngagementsSearchResults;
  searchUsers: UsersSearchResults;
  teacherCohorts: Array<Cohort>;
  users: Array<User>;
};


export type QueryCohortArgs = {
  id: Scalars['ID'];
};


export type QueryCohortsForOrgArgs = {
  organizationId: Scalars['ID'];
};


export type QueryEngagementArgs = {
  id: Scalars['ID'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID'];
};


export type QuerySearchEngagementsArgs = {
  query: Scalars['String'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String'];
};

export type Time = {
  hour: Scalars['Int'];
  minute: Scalars['Int'];
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

export type UsersSearchResults = {
  __typename?: 'UsersSearchResults';
  count: Scalars['Int'];
  results: Array<User>;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', email: string, accountStatus: AccountStatus, role: UserRole, fullName: string } | null };

export type AddCohortMutationVariables = Exact<{
  input: AddCohortInput;
}>;


export type AddCohortMutation = { __typename?: 'Mutation', addCohort: { __typename?: 'Cohort', id: string, name: string } };

export type EngagementForAddNewCohortModalFragment = { __typename?: 'Engagement', id: string, startDate?: any | null, endDate?: any | null };

export type AllCohortsTableFragment = { __typename?: 'Query', cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, createdAt: any, grade?: string | null, startDate?: any | null, endDate?: any | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type CohortDetailsFragment = { __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, startDate?: any | null, endDate?: any | null, engagement: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type CohortForDetailsSidebarFragment = { __typename?: 'Cohort', name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, createdAt: any, id: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } };

export type CohortDetailsRoomFragment = { __typename?: 'Cohort', id: string, name: string, meetingRoom?: string | null, hostKey?: string | null, startDate?: any | null, endDate?: any | null };

export type CohortsFragment = { __typename?: 'Query', cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, createdAt: any, grade?: string | null, startDate?: any | null, endDate?: any | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type CohortForTableFragment = { __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, engagement: { __typename?: 'Engagement', id: string, name: string }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type DeleteCohortMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCohortMutation = { __typename?: 'Mutation', deleteCohort: { __typename?: 'Cohort', id: string, name: string } };

export type EditCohortMutationVariables = Exact<{
  input: EditCohortInput;
}>;


export type EditCohortMutation = { __typename?: 'Mutation', editCohort: { __typename?: 'Cohort', id: string, name: string } };

export type EngagementCohortsViewFragment = { __typename?: 'Engagement', id: string, startDate?: any | null, endDate?: any | null, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type CohortsViewListFFragment = { __typename?: 'Organization', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> }> };

export type SaveCohortsCsvDataMutationVariables = Exact<{
  input: CsvProcessedData;
}>;


export type SaveCohortsCsvDataMutation = { __typename?: 'Mutation', saveCohortsCsvData: { __typename?: 'CsvSaveCountsResult', newTeacherCount: number, newCohortCount: number } };

export type CohortForCohortsScheduleCalendarFragment = { __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } };

export type CohortForScheduleCalendarModalFragment = { __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } };

export type AddEngagementMutationVariables = Exact<{
  input: AddEngagementInput;
}>;


export type AddEngagementMutation = { __typename?: 'Mutation', addEngagement: { __typename?: 'Engagement', id: string, name: string } };

export type DeleteEngagementMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEngagementMutation = { __typename?: 'Mutation', deleteEngagement: { __typename?: 'Engagement', id: string, name: string } };

export type DeleteEngagementModalEngagementFragment = { __typename?: 'Engagement', id: string, name: string, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', user: { __typename?: 'User', id: string } }> };

export type EditEngagementMutationVariables = Exact<{
  input: EditEngagementInput;
}>;


export type EditEngagementMutation = { __typename?: 'Mutation', editEngagement: { __typename?: 'Engagement', id: string, name: string } };

export type EngagementForEditEngagementModalFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type EngagementDetailsPageCohortsFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', name: string, id: string }, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type EngagementDetailsPageCsvUploadFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type FlatEngagementsPageFragment = { __typename?: 'Query', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type SearchEngagementsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchEngagementsQuery = { __typename?: 'Query', searchEngagements: { __typename?: 'EngagementsSearchResults', count: number, results: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> } };

export type FlatEngagementsTableEngagementFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type EngagementsViewListFFragment = { __typename?: 'Organization', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

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

export type EngagementsViewFFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type CohortsViewFFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> }> };

export type OrganizationsFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> }> };

export type OrganizationsTableFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> }> };

export type CurrentUserQueryForMySchedulePageFragment = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string } | null, teacherCohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> };

export type SearchUsersQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'UsersSearchResults', count: number, results: Array<{ __typename?: 'User', id: string, fullName: string, email: string }> } };

export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'User', id: string } };

export type UsersPageFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus }> };

export type UsersTableFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus }> };

export type CohortDetailsPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CohortDetailsPageQuery = { __typename?: 'Query', cohort: { __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, startDate?: any | null, endDate?: any | null, engagement: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> } };

export type CohortDetailsRoomPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CohortDetailsRoomPageQuery = { __typename?: 'Query', cohort: { __typename?: 'Cohort', id: string, name: string, meetingRoom?: string | null, hostKey?: string | null, startDate?: any | null, endDate?: any | null } };

export type CohortsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type CohortsPageQuery = { __typename?: 'Query', cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, createdAt: any, grade?: string | null, startDate?: any | null, endDate?: any | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type FlatEngagementsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type FlatEngagementsPageQuery = { __typename?: 'Query', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type MySchedulePageQueryVariables = Exact<{ [key: string]: never; }>;


export type MySchedulePageQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string } | null, teacherCohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> };

export type OrgDetailPageCohortsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageCohortsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> }> } | null };

export type EngagementDetailsPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EngagementDetailsPageQuery = { __typename?: 'Query', engagement?: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', name: string, id: string }, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> } | null };

export type EngagementCsvUploadPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EngagementCsvUploadPageQuery = { __typename?: 'Query', engagement?: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> } | null };

export type OrgDetailPageEngagementsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageEngagementsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> } | null };

export type OrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationsPageQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> }> };

export type UsersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPageQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus }> };

export const CohortDetailsFragmentDoc = gql`
    fragment CohortDetails on Cohort {
  id
  createdAt
  name
  grade
  meetingRoom
  hostKey
  meetingId
  startDate
  endDate
  engagement {
    id
    name
    startDate
    endDate
    organization {
      id
      name
    }
  }
  staffAssignments {
    user {
      id
      fullName
      email
    }
    subject
  }
}
    `;
export const CohortDetailsRoomFragmentDoc = gql`
    fragment CohortDetailsRoom on Cohort {
  id
  name
  meetingRoom
  hostKey
  startDate
  endDate
}
    `;
export const AllCohortsTableFragmentDoc = gql`
    fragment AllCohortsTable on Query {
  cohorts {
    id
    name
    createdAt
    grade
    startDate
    endDate
    engagement {
      id
      name
      organization {
        id
        name
      }
    }
    staffAssignments {
      user {
        id
        fullName
        email
      }
      subject
    }
  }
}
    `;
export const CohortsFragmentDoc = gql`
    fragment Cohorts on Query {
  ...AllCohortsTable
}
    ${AllCohortsTableFragmentDoc}`;
export const CohortForTableFragmentDoc = gql`
    fragment CohortForTable on Cohort {
  id
  createdAt
  name
  grade
  meetingRoom
  hostKey
  exempt
  startDate
  endDate
  engagementId
  engagement {
    id
    name
  }
  staffAssignments {
    user {
      id
      fullName
      email
    }
    subject
  }
}
    `;
export const CohortForCohortsScheduleCalendarFragmentDoc = gql`
    fragment CohortForCohortsScheduleCalendar on Cohort {
  id
  name
  grade
  startDate
  endDate
  events {
    startFloatingDateTime
    timeZone
    durationMinutes
    subject
  }
  staffAssignments {
    user {
      id
      role
      fullName
    }
    subject
  }
  meetingRoom
  hostKey
  meetingId
  engagement {
    name
    organization {
      name
    }
  }
}
    `;
export const CohortForScheduleCalendarModalFragmentDoc = gql`
    fragment CohortForScheduleCalendarModal on Cohort {
  ...CohortForCohortsScheduleCalendar
}
    ${CohortForCohortsScheduleCalendarFragmentDoc}`;
export const CohortForDetailsSidebarFragmentDoc = gql`
    fragment CohortForDetailsSidebar on Cohort {
  name
  startDate
  endDate
  grade
  meetingRoom
  hostKey
  createdAt
  staffAssignments {
    user {
      id
      fullName
    }
    subject
  }
  ...CohortForScheduleCalendarModal
}
    ${CohortForScheduleCalendarModalFragmentDoc}`;
export const EngagementForAddNewCohortModalFragmentDoc = gql`
    fragment EngagementForAddNewCohortModal on Engagement {
  id
  startDate
  endDate
}
    `;
export const EngagementCohortsViewFragmentDoc = gql`
    fragment EngagementCohortsView on Engagement {
  cohorts {
    ...CohortForTable
    ...CohortForDetailsSidebar
  }
  ...EngagementForAddNewCohortModal
}
    ${CohortForTableFragmentDoc}
${CohortForDetailsSidebarFragmentDoc}
${EngagementForAddNewCohortModalFragmentDoc}`;
export const EngagementForEditEngagementModalFragmentDoc = gql`
    fragment EngagementForEditEngagementModal on Engagement {
  id
  name
  startDate
  endDate
  staffAssignments {
    user {
      id
      fullName
      email
    }
    role
  }
}
    `;
export const EngagementDetailsPageCohortsFragmentDoc = gql`
    fragment EngagementDetailsPageCohorts on Engagement {
  id
  name
  startDate
  endDate
  staffAssignments {
    user {
      id
      fullName
      email
    }
    role
  }
  organization {
    name
    id
  }
  ...EngagementCohortsView
  ...EngagementForEditEngagementModal
}
    ${EngagementCohortsViewFragmentDoc}
${EngagementForEditEngagementModalFragmentDoc}`;
export const EngagementDetailsPageCsvUploadFragmentDoc = gql`
    fragment EngagementDetailsPageCsvUpload on Engagement {
  id
  name
  startDate
  endDate
  organization {
    id
    name
  }
  cohorts {
    id
  }
  ...EngagementForEditEngagementModal
}
    ${EngagementForEditEngagementModalFragmentDoc}`;
export const DeleteEngagementModalEngagementFragmentDoc = gql`
    fragment DeleteEngagementModalEngagement on Engagement {
  id
  name
  cohorts {
    id
  }
  staffAssignments {
    user {
      id
    }
  }
}
    `;
export const FlatEngagementsTableEngagementFragmentDoc = gql`
    fragment FlatEngagementsTableEngagement on Engagement {
  id
  name
  startDate
  endDate
  organization {
    id
    name
  }
  ...DeleteEngagementModalEngagement
  ...EngagementForEditEngagementModal
}
    ${DeleteEngagementModalEngagementFragmentDoc}
${EngagementForEditEngagementModalFragmentDoc}`;
export const FlatEngagementsPageFragmentDoc = gql`
    fragment FlatEngagementsPage on Query {
  engagements {
    ...FlatEngagementsTableEngagement
  }
}
    ${FlatEngagementsTableEngagementFragmentDoc}`;
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
      role
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
      engagementId
      staffAssignments {
        user {
          id
          fullName
          email
        }
        subject
      }
      ...CohortForDetailsSidebar
    }
  }
}
    ${CohortForDetailsSidebarFragmentDoc}`;
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
    engagements {
      id
    }
  }
}
    `;
export const OrganizationsFragmentDoc = gql`
    fragment Organizations on Query {
  ...OrganizationsTable
}
    ${OrganizationsTableFragmentDoc}`;
export const CurrentUserQueryForMySchedulePageFragmentDoc = gql`
    fragment CurrentUserQueryForMySchedulePage on Query {
  currentUser {
    id
  }
  teacherCohorts {
    ...CohortForCohortsScheduleCalendar
  }
}
    ${CohortForCohortsScheduleCalendarFragmentDoc}`;
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
    fullName
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
export const AddCohortDocument = gql`
    mutation AddCohort($input: AddCohortInput!) {
  addCohort(input: $input) {
    id
    name
  }
}
    `;
export type AddCohortMutationFn = Apollo.MutationFunction<AddCohortMutation, AddCohortMutationVariables>;

/**
 * __useAddCohortMutation__
 *
 * To run a mutation, you first call `useAddCohortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCohortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCohortMutation, { data, loading, error }] = useAddCohortMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddCohortMutation(baseOptions?: Apollo.MutationHookOptions<AddCohortMutation, AddCohortMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCohortMutation, AddCohortMutationVariables>(AddCohortDocument, options);
      }
export type AddCohortMutationHookResult = ReturnType<typeof useAddCohortMutation>;
export type AddCohortMutationResult = Apollo.MutationResult<AddCohortMutation>;
export type AddCohortMutationOptions = Apollo.BaseMutationOptions<AddCohortMutation, AddCohortMutationVariables>;
export const DeleteCohortDocument = gql`
    mutation DeleteCohort($id: ID!) {
  deleteCohort(id: $id) {
    id
    name
  }
}
    `;
export type DeleteCohortMutationFn = Apollo.MutationFunction<DeleteCohortMutation, DeleteCohortMutationVariables>;

/**
 * __useDeleteCohortMutation__
 *
 * To run a mutation, you first call `useDeleteCohortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCohortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCohortMutation, { data, loading, error }] = useDeleteCohortMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCohortMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCohortMutation, DeleteCohortMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCohortMutation, DeleteCohortMutationVariables>(DeleteCohortDocument, options);
      }
export type DeleteCohortMutationHookResult = ReturnType<typeof useDeleteCohortMutation>;
export type DeleteCohortMutationResult = Apollo.MutationResult<DeleteCohortMutation>;
export type DeleteCohortMutationOptions = Apollo.BaseMutationOptions<DeleteCohortMutation, DeleteCohortMutationVariables>;
export const EditCohortDocument = gql`
    mutation EditCohort($input: EditCohortInput!) {
  editCohort(input: $input) {
    id
    name
  }
}
    `;
export type EditCohortMutationFn = Apollo.MutationFunction<EditCohortMutation, EditCohortMutationVariables>;

/**
 * __useEditCohortMutation__
 *
 * To run a mutation, you first call `useEditCohortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCohortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCohortMutation, { data, loading, error }] = useEditCohortMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditCohortMutation(baseOptions?: Apollo.MutationHookOptions<EditCohortMutation, EditCohortMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditCohortMutation, EditCohortMutationVariables>(EditCohortDocument, options);
      }
export type EditCohortMutationHookResult = ReturnType<typeof useEditCohortMutation>;
export type EditCohortMutationResult = Apollo.MutationResult<EditCohortMutation>;
export type EditCohortMutationOptions = Apollo.BaseMutationOptions<EditCohortMutation, EditCohortMutationVariables>;
export const SaveCohortsCsvDataDocument = gql`
    mutation SaveCohortsCsvData($input: CsvProcessedData!) {
  saveCohortsCsvData(input: $input) {
    newTeacherCount
    newCohortCount
  }
}
    `;
export type SaveCohortsCsvDataMutationFn = Apollo.MutationFunction<SaveCohortsCsvDataMutation, SaveCohortsCsvDataMutationVariables>;

/**
 * __useSaveCohortsCsvDataMutation__
 *
 * To run a mutation, you first call `useSaveCohortsCsvDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveCohortsCsvDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveCohortsCsvDataMutation, { data, loading, error }] = useSaveCohortsCsvDataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveCohortsCsvDataMutation(baseOptions?: Apollo.MutationHookOptions<SaveCohortsCsvDataMutation, SaveCohortsCsvDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveCohortsCsvDataMutation, SaveCohortsCsvDataMutationVariables>(SaveCohortsCsvDataDocument, options);
      }
export type SaveCohortsCsvDataMutationHookResult = ReturnType<typeof useSaveCohortsCsvDataMutation>;
export type SaveCohortsCsvDataMutationResult = Apollo.MutationResult<SaveCohortsCsvDataMutation>;
export type SaveCohortsCsvDataMutationOptions = Apollo.BaseMutationOptions<SaveCohortsCsvDataMutation, SaveCohortsCsvDataMutationVariables>;
export const AddEngagementDocument = gql`
    mutation AddEngagement($input: AddEngagementInput!) {
  addEngagement(input: $input) {
    id
    name
  }
}
    `;
export type AddEngagementMutationFn = Apollo.MutationFunction<AddEngagementMutation, AddEngagementMutationVariables>;

/**
 * __useAddEngagementMutation__
 *
 * To run a mutation, you first call `useAddEngagementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEngagementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEngagementMutation, { data, loading, error }] = useAddEngagementMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddEngagementMutation(baseOptions?: Apollo.MutationHookOptions<AddEngagementMutation, AddEngagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEngagementMutation, AddEngagementMutationVariables>(AddEngagementDocument, options);
      }
export type AddEngagementMutationHookResult = ReturnType<typeof useAddEngagementMutation>;
export type AddEngagementMutationResult = Apollo.MutationResult<AddEngagementMutation>;
export type AddEngagementMutationOptions = Apollo.BaseMutationOptions<AddEngagementMutation, AddEngagementMutationVariables>;
export const DeleteEngagementDocument = gql`
    mutation DeleteEngagement($id: ID!) {
  deleteEngagement(id: $id) {
    id
    name
  }
}
    `;
export type DeleteEngagementMutationFn = Apollo.MutationFunction<DeleteEngagementMutation, DeleteEngagementMutationVariables>;

/**
 * __useDeleteEngagementMutation__
 *
 * To run a mutation, you first call `useDeleteEngagementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEngagementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEngagementMutation, { data, loading, error }] = useDeleteEngagementMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEngagementMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEngagementMutation, DeleteEngagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEngagementMutation, DeleteEngagementMutationVariables>(DeleteEngagementDocument, options);
      }
export type DeleteEngagementMutationHookResult = ReturnType<typeof useDeleteEngagementMutation>;
export type DeleteEngagementMutationResult = Apollo.MutationResult<DeleteEngagementMutation>;
export type DeleteEngagementMutationOptions = Apollo.BaseMutationOptions<DeleteEngagementMutation, DeleteEngagementMutationVariables>;
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
export const SearchEngagementsDocument = gql`
    query SearchEngagements($query: String!) {
  searchEngagements(query: $query) {
    count
    results {
      ...FlatEngagementsTableEngagement
    }
  }
}
    ${FlatEngagementsTableEngagementFragmentDoc}`;

/**
 * __useSearchEngagementsQuery__
 *
 * To run a query within a React component, call `useSearchEngagementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEngagementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEngagementsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchEngagementsQuery(baseOptions: Apollo.QueryHookOptions<SearchEngagementsQuery, SearchEngagementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchEngagementsQuery, SearchEngagementsQueryVariables>(SearchEngagementsDocument, options);
      }
export function useSearchEngagementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchEngagementsQuery, SearchEngagementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchEngagementsQuery, SearchEngagementsQueryVariables>(SearchEngagementsDocument, options);
        }
export type SearchEngagementsQueryHookResult = ReturnType<typeof useSearchEngagementsQuery>;
export type SearchEngagementsLazyQueryHookResult = ReturnType<typeof useSearchEngagementsLazyQuery>;
export type SearchEngagementsQueryResult = Apollo.QueryResult<SearchEngagementsQuery, SearchEngagementsQueryVariables>;
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
export const CohortDetailsPageDocument = gql`
    query CohortDetailsPage($id: ID!) {
  cohort(id: $id) {
    ...CohortDetails
  }
}
    ${CohortDetailsFragmentDoc}`;

/**
 * __useCohortDetailsPageQuery__
 *
 * To run a query within a React component, call `useCohortDetailsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCohortDetailsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCohortDetailsPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCohortDetailsPageQuery(baseOptions: Apollo.QueryHookOptions<CohortDetailsPageQuery, CohortDetailsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CohortDetailsPageQuery, CohortDetailsPageQueryVariables>(CohortDetailsPageDocument, options);
      }
export function useCohortDetailsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CohortDetailsPageQuery, CohortDetailsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CohortDetailsPageQuery, CohortDetailsPageQueryVariables>(CohortDetailsPageDocument, options);
        }
export type CohortDetailsPageQueryHookResult = ReturnType<typeof useCohortDetailsPageQuery>;
export type CohortDetailsPageLazyQueryHookResult = ReturnType<typeof useCohortDetailsPageLazyQuery>;
export type CohortDetailsPageQueryResult = Apollo.QueryResult<CohortDetailsPageQuery, CohortDetailsPageQueryVariables>;
export const CohortDetailsRoomPageDocument = gql`
    query CohortDetailsRoomPage($id: ID!) {
  cohort(id: $id) {
    ...CohortDetailsRoom
  }
}
    ${CohortDetailsRoomFragmentDoc}`;

/**
 * __useCohortDetailsRoomPageQuery__
 *
 * To run a query within a React component, call `useCohortDetailsRoomPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCohortDetailsRoomPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCohortDetailsRoomPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCohortDetailsRoomPageQuery(baseOptions: Apollo.QueryHookOptions<CohortDetailsRoomPageQuery, CohortDetailsRoomPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CohortDetailsRoomPageQuery, CohortDetailsRoomPageQueryVariables>(CohortDetailsRoomPageDocument, options);
      }
export function useCohortDetailsRoomPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CohortDetailsRoomPageQuery, CohortDetailsRoomPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CohortDetailsRoomPageQuery, CohortDetailsRoomPageQueryVariables>(CohortDetailsRoomPageDocument, options);
        }
export type CohortDetailsRoomPageQueryHookResult = ReturnType<typeof useCohortDetailsRoomPageQuery>;
export type CohortDetailsRoomPageLazyQueryHookResult = ReturnType<typeof useCohortDetailsRoomPageLazyQuery>;
export type CohortDetailsRoomPageQueryResult = Apollo.QueryResult<CohortDetailsRoomPageQuery, CohortDetailsRoomPageQueryVariables>;
export const CohortsPageDocument = gql`
    query CohortsPage {
  ...Cohorts
}
    ${CohortsFragmentDoc}`;

/**
 * __useCohortsPageQuery__
 *
 * To run a query within a React component, call `useCohortsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCohortsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCohortsPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useCohortsPageQuery(baseOptions?: Apollo.QueryHookOptions<CohortsPageQuery, CohortsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CohortsPageQuery, CohortsPageQueryVariables>(CohortsPageDocument, options);
      }
export function useCohortsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CohortsPageQuery, CohortsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CohortsPageQuery, CohortsPageQueryVariables>(CohortsPageDocument, options);
        }
export type CohortsPageQueryHookResult = ReturnType<typeof useCohortsPageQuery>;
export type CohortsPageLazyQueryHookResult = ReturnType<typeof useCohortsPageLazyQuery>;
export type CohortsPageQueryResult = Apollo.QueryResult<CohortsPageQuery, CohortsPageQueryVariables>;
export const FlatEngagementsPageDocument = gql`
    query FlatEngagementsPage {
  ...FlatEngagementsPage
}
    ${FlatEngagementsPageFragmentDoc}`;

/**
 * __useFlatEngagementsPageQuery__
 *
 * To run a query within a React component, call `useFlatEngagementsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlatEngagementsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlatEngagementsPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useFlatEngagementsPageQuery(baseOptions?: Apollo.QueryHookOptions<FlatEngagementsPageQuery, FlatEngagementsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FlatEngagementsPageQuery, FlatEngagementsPageQueryVariables>(FlatEngagementsPageDocument, options);
      }
export function useFlatEngagementsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FlatEngagementsPageQuery, FlatEngagementsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FlatEngagementsPageQuery, FlatEngagementsPageQueryVariables>(FlatEngagementsPageDocument, options);
        }
export type FlatEngagementsPageQueryHookResult = ReturnType<typeof useFlatEngagementsPageQuery>;
export type FlatEngagementsPageLazyQueryHookResult = ReturnType<typeof useFlatEngagementsPageLazyQuery>;
export type FlatEngagementsPageQueryResult = Apollo.QueryResult<FlatEngagementsPageQuery, FlatEngagementsPageQueryVariables>;
export const MySchedulePageDocument = gql`
    query MySchedulePage {
  ...CurrentUserQueryForMySchedulePage
}
    ${CurrentUserQueryForMySchedulePageFragmentDoc}`;

/**
 * __useMySchedulePageQuery__
 *
 * To run a query within a React component, call `useMySchedulePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySchedulePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySchedulePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySchedulePageQuery(baseOptions?: Apollo.QueryHookOptions<MySchedulePageQuery, MySchedulePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MySchedulePageQuery, MySchedulePageQueryVariables>(MySchedulePageDocument, options);
      }
export function useMySchedulePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySchedulePageQuery, MySchedulePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MySchedulePageQuery, MySchedulePageQueryVariables>(MySchedulePageDocument, options);
        }
export type MySchedulePageQueryHookResult = ReturnType<typeof useMySchedulePageQuery>;
export type MySchedulePageLazyQueryHookResult = ReturnType<typeof useMySchedulePageLazyQuery>;
export type MySchedulePageQueryResult = Apollo.QueryResult<MySchedulePageQuery, MySchedulePageQueryVariables>;
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
export const EngagementDetailsPageDocument = gql`
    query EngagementDetailsPage($id: ID!) {
  engagement(id: $id) {
    ...EngagementDetailsPageCohorts
  }
}
    ${EngagementDetailsPageCohortsFragmentDoc}`;

/**
 * __useEngagementDetailsPageQuery__
 *
 * To run a query within a React component, call `useEngagementDetailsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useEngagementDetailsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEngagementDetailsPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEngagementDetailsPageQuery(baseOptions: Apollo.QueryHookOptions<EngagementDetailsPageQuery, EngagementDetailsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EngagementDetailsPageQuery, EngagementDetailsPageQueryVariables>(EngagementDetailsPageDocument, options);
      }
export function useEngagementDetailsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EngagementDetailsPageQuery, EngagementDetailsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EngagementDetailsPageQuery, EngagementDetailsPageQueryVariables>(EngagementDetailsPageDocument, options);
        }
export type EngagementDetailsPageQueryHookResult = ReturnType<typeof useEngagementDetailsPageQuery>;
export type EngagementDetailsPageLazyQueryHookResult = ReturnType<typeof useEngagementDetailsPageLazyQuery>;
export type EngagementDetailsPageQueryResult = Apollo.QueryResult<EngagementDetailsPageQuery, EngagementDetailsPageQueryVariables>;
export const EngagementCsvUploadPageDocument = gql`
    query EngagementCsvUploadPage($id: ID!) {
  engagement(id: $id) {
    ...EngagementDetailsPageCsvUpload
  }
}
    ${EngagementDetailsPageCsvUploadFragmentDoc}`;

/**
 * __useEngagementCsvUploadPageQuery__
 *
 * To run a query within a React component, call `useEngagementCsvUploadPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useEngagementCsvUploadPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEngagementCsvUploadPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEngagementCsvUploadPageQuery(baseOptions: Apollo.QueryHookOptions<EngagementCsvUploadPageQuery, EngagementCsvUploadPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EngagementCsvUploadPageQuery, EngagementCsvUploadPageQueryVariables>(EngagementCsvUploadPageDocument, options);
      }
export function useEngagementCsvUploadPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EngagementCsvUploadPageQuery, EngagementCsvUploadPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EngagementCsvUploadPageQuery, EngagementCsvUploadPageQueryVariables>(EngagementCsvUploadPageDocument, options);
        }
export type EngagementCsvUploadPageQueryHookResult = ReturnType<typeof useEngagementCsvUploadPageQuery>;
export type EngagementCsvUploadPageLazyQueryHookResult = ReturnType<typeof useEngagementCsvUploadPageLazyQuery>;
export type EngagementCsvUploadPageQueryResult = Apollo.QueryResult<EngagementCsvUploadPageQuery, EngagementCsvUploadPageQueryVariables>;
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