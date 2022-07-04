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

export type CohortsSearchResults = {
  __typename?: 'CohortsSearchResults';
  count: Scalars['Int'];
  results: Array<Cohort>;
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
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  engagements: Array<Engagement>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  subDistrict?: Maybe<Scalars['String']>;
};

export type OrganizationsSearchResults = {
  __typename?: 'OrganizationsSearchResults';
  count: Scalars['Int'];
  results: Array<Organization>;
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
  searchCohorts: CohortsSearchResults;
  searchEngagements: EngagementsSearchResults;
  searchOrganizations: OrganizationsSearchResults;
  searchUsers: UsersSearchResults;
  teacherCohorts: Array<Cohort>;
  teacherEngagements: Array<Engagement>;
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


export type QuerySearchCohortsArgs = {
  query: Scalars['String'];
};


export type QuerySearchEngagementsArgs = {
  query: Scalars['String'];
};


export type QuerySearchOrganizationsArgs = {
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
  inviteSentAt?: Maybe<Scalars['Date']>;
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

export type AddNewCohortModal_EngagementFragment = { __typename?: 'Engagement', id: string, startDate?: any | null, endDate?: any | null };

export type CohortDetailsTabs_CohortFragment = { __typename?: 'Cohort', id: string, name: string, startDate?: any | null, endDate?: any | null, createdAt: any, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> };

export type CohortDetailsView_CohortFragment = { __typename?: 'Cohort', id: string, name: string, createdAt: any, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }> };

export type CohortDetailsPageDetails_CohortFragment = { __typename?: 'Cohort', id: string, name: string, startDate?: any | null, endDate?: any | null, createdAt: any, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> };

export type CohortDetailsSidebar_CohortFragment = { __typename?: 'Cohort', name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, createdAt: any, id: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } };

export type CohortDetailsRoomFragment = { __typename?: 'Cohort', id: string, name: string, meetingRoom?: string | null, hostKey?: string | null, startDate?: any | null, endDate?: any | null };

export type CohortsTable_CohortFragment = { __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, engagement: { __typename?: 'Engagement', id: string, name: string }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type DeleteCohortMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCohortMutation = { __typename?: 'Mutation', deleteCohort: { __typename?: 'Cohort', id: string, name: string } };

export type DeleteCohortModal_CohortFragment = { __typename?: 'Cohort', id: string, name: string, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', user: { __typename?: 'User', id: string } }> };

export type EditCohortMutationVariables = Exact<{
  input: EditCohortInput;
}>;


export type EditCohortMutation = { __typename?: 'Mutation', editCohort: { __typename?: 'Cohort', id: string, name: string } };

export type EditCohortModal_CohortFragment = { __typename?: 'Cohort', id: string, name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, hostKey?: string | null, meetingRoom?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type EngagementCohortsViewFragment = { __typename?: 'Engagement', id: string, startDate?: any | null, endDate?: any | null, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type FlatCohortsPage_CohortsFragment = { __typename?: 'Query', cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingRoom?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type SearchCohortsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchCohortsQuery = { __typename?: 'Query', searchCohorts: { __typename?: 'CohortsSearchResults', count: number, results: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingRoom?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> } };

export type FlatCohortsTable_CohortFragment = { __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingRoom?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type OrganizationCohortsView_CohortsViewFragment = { __typename?: 'Organization', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, createdAt: any, id: string, exempt?: string | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }> };

export type CsvUploadView_EngagementFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }> };

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

export type EngagementDetailsPage_CommonFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type EngagementDetailsPage_DetailsFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, createdAt: any, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string }> };

export type EngagementDetailsPageCohortsFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type EngagementDetailsPageCsvUploadFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string }> };

export type EngagementDetailsTabs_CommonFragment = { __typename?: 'Engagement', id: string, organization: { __typename?: 'Organization', id: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }> };

export type EngagementDetailsTabs_DetailsFragment = { __typename?: 'Engagement', id: string, name: string, createdAt: any, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string } }> };

export type EngagementDetailsTabs_CohortsFragment = { __typename?: 'Engagement', id: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string }, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type EngagementDetailsTabs_CsvUploadFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }> };

export type EngagementDetailsView_EngagementFragment = { __typename?: 'Engagement', id: string, name: string, createdAt: any, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string } }> };

export type EngagementsTable_EngagementFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', id: string } };

export type FlatEngagementsPageFragment = { __typename?: 'Query', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type SearchEngagementsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchEngagementsQuery = { __typename?: 'Query', searchEngagements: { __typename?: 'EngagementsSearchResults', count: number, results: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> } };

export type FlatEngagementsTableEngagementFragment = { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> };

export type OrganizationEngagementsView_EngagementsViewFragment = { __typename?: 'Organization', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', id: string } }> };

export type MentorTeacherHome_HomeFragment = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, role: UserRole } | null, teacherEngagements: Array<{ __typename?: 'Engagement', startDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }> };

export type TeacherCohortsPanel_CohortFragment = { __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> };

export type TutorTeacherHome_HomeFragment = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, role: UserRole } | null, teacherEngagements: Array<{ __typename?: 'Engagement', startDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }>, teacherCohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type WelcomePanel_UserFragment = { __typename?: 'User', fullName: string, role: UserRole };

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

export type OrganizationDetailPage_DetailsFragment = { __typename?: 'Organization', id: string, description?: string | null, name: string, createdAt: any, location?: string | null, district?: string | null, subDistrict?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, cohorts: Array<{ __typename?: 'Cohort', id: string }> }> };

export type OrganizationDetailPage_EngagementsFragment = { __typename?: 'Organization', id: string, description?: string | null, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', id: string } }> };

export type OrganizationDetailPage_CohortsFragment = { __typename?: 'Organization', id: string, description?: string | null, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, createdAt: any, id: string, exempt?: string | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }> };

export type OrganizationDetailsView_OrganizationFragment = { __typename?: 'Organization', id: string, name: string, createdAt: any, location?: string | null, description?: string | null, district?: string | null, subDistrict?: string | null };

export type OrganizationTabs_DetailsFragment = { __typename?: 'Organization', id: string, name: string, createdAt: any, location?: string | null, description?: string | null, district?: string | null, subDistrict?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, cohorts: Array<{ __typename?: 'Cohort', id: string }> }> };

export type OrganizationTabs_EngagementsFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', id: string } }> };

export type OrganizationTabs_CohortsFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, createdAt: any, id: string, exempt?: string | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }> };

export type OrganizationsPage_OrganizationsFragment = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> }> };

export type SearchOrganizationsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchOrganizationsQuery = { __typename?: 'Query', searchOrganizations: { __typename?: 'OrganizationsSearchResults', count: number, results: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> }> } };

export type OrganizationsTable_OrganizationFragment = { __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> };

export type CurrentUserQueryForMySchedulePageFragment = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string } | null, teacherCohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> };

export type SearchUsersQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'UsersSearchResults', count: number, results: Array<{ __typename?: 'User', id: string, fullName: string, email: string }> } };

export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'User', id: string } };

export type UsersPageFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus, inviteSentAt?: any | null }> };

export type SearchUsersForUsersPageQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchUsersForUsersPageQuery = { __typename?: 'Query', searchUsers: { __typename?: 'UsersSearchResults', count: number, results: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus, inviteSentAt?: any | null }> } };

export type UsersTableFragment = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus, inviteSentAt?: any | null }> };

export type CohortDetailsPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CohortDetailsPageQuery = { __typename?: 'Query', cohort: { __typename?: 'Cohort', id: string, name: string, startDate?: any | null, endDate?: any | null, createdAt: any, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> } };

export type CohortDetailsRoomPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CohortDetailsRoomPageQuery = { __typename?: 'Query', cohort: { __typename?: 'Cohort', id: string, name: string, meetingRoom?: string | null, hostKey?: string | null, startDate?: any | null, endDate?: any | null } };

export type FlatCohortsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type FlatCohortsPageQuery = { __typename?: 'Query', cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingRoom?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type FlatEngagementsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type FlatEngagementsPageQuery = { __typename?: 'Query', engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, cohorts: Array<{ __typename?: 'Cohort', id: string }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }> }> };

export type HomePageAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageAdminQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', fullName: string } | null };

export type HomePageMentorQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageMentorQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, role: UserRole } | null, teacherEngagements: Array<{ __typename?: 'Engagement', startDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }> };

export type HomePageTutorQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageTutorQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, fullName: string, role: UserRole } | null, teacherEngagements: Array<{ __typename?: 'Engagement', startDate?: any | null, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }>, teacherCohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, meetingRoom?: string | null, startDate?: any | null, endDate?: any | null, hostKey?: string | null, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', fullName: string, id: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> };

export type MySchedulePageQueryVariables = Exact<{ [key: string]: never; }>;


export type MySchedulePageQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string } | null, teacherCohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null, meetingRoom?: string | null, hostKey?: string | null, meetingId?: string | null, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }>, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, role: UserRole, fullName: string } }>, engagement: { __typename?: 'Engagement', name: string, organization: { __typename?: 'Organization', name: string } } }> };

export type OrgDetailPageCohortsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageCohortsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, description?: string | null, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', name: string, startDate?: any | null, endDate?: any | null, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, createdAt: any, id: string, exempt?: string | null, engagementId: string, meetingId?: string | null, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> }> } | null };

export type OrgDetailPageDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageDetailsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, description?: string | null, name: string, createdAt: any, location?: string | null, district?: string | null, subDistrict?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, cohorts: Array<{ __typename?: 'Cohort', id: string }> }> } | null };

export type EngagementDetailsPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EngagementDetailsPageQuery = { __typename?: 'Query', engagement?: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string, createdAt: any, name: string, grade?: string | null, meetingRoom?: string | null, hostKey?: string | null, exempt?: string | null, startDate?: any | null, endDate?: any | null, engagementId: string, meetingId?: string | null, engagement: { __typename?: 'Engagement', id: string, name: string, organization: { __typename?: 'Organization', name: string } }, staffAssignments: Array<{ __typename?: 'CohortStaffAssignment', subject: AssignmentSubject, user: { __typename?: 'User', id: string, fullName: string, email: string, role: UserRole } }>, events: Array<{ __typename?: 'CohortEvent', startFloatingDateTime: any, timeZone: string, durationMinutes: number, subject: AssignmentSubject }> }> } | null };

export type EngagementDetail_DetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EngagementDetail_DetailsQuery = { __typename?: 'Query', engagement?: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, createdAt: any, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string }> } | null };

export type EngagementCsvUploadPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EngagementCsvUploadPageQuery = { __typename?: 'Query', engagement?: { __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organization: { __typename?: 'Organization', id: string, name: string }, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, cohorts: Array<{ __typename?: 'Cohort', id: string }> } | null };

export type OrgDetailPageEngagementsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrgDetailPageEngagementsQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, description?: string | null, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string, name: string, startDate?: any | null, endDate?: any | null, organizationId: string, cohorts: Array<{ __typename?: 'Cohort', id: string, name: string, grade?: string | null, startDate?: any | null, endDate?: any | null }>, staffAssignments: Array<{ __typename?: 'EngagementStaffAssignment', role: AssignmentRole, user: { __typename?: 'User', id: string, fullName: string, email: string } }>, organization: { __typename?: 'Organization', id: string } }> } | null };

export type OrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationsPageQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, name: string, district?: string | null, subDistrict?: string | null, location?: string | null, description?: string | null, engagements: Array<{ __typename?: 'Engagement', id: string }> }> };

export type UsersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPageQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, role: UserRole, accountStatus: AccountStatus, inviteSentAt?: any | null }> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', email: string, accountStatus: AccountStatus, role: UserRole, fullName: string } | null };

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
export const CohortDetailsView_CohortFragmentDoc = gql`
    fragment CohortDetailsView_Cohort on Cohort {
  id
  name
  createdAt
  startDate
  endDate
  grade
  meetingRoom
  hostKey
  meetingId
  engagement {
    id
    name
    organization {
      id
      name
    }
  }
  ...CohortForScheduleCalendarModal
}
    ${CohortForScheduleCalendarModalFragmentDoc}`;
export const CohortDetailsTabs_CohortFragmentDoc = gql`
    fragment CohortDetailsTabs_Cohort on Cohort {
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
    subject
  }
  ...CohortDetailsView_Cohort
}
    ${CohortDetailsView_CohortFragmentDoc}`;
export const CohortDetailsPageDetails_CohortFragmentDoc = gql`
    fragment CohortDetailsPageDetails_Cohort on Cohort {
  ...CohortDetailsTabs_Cohort
}
    ${CohortDetailsTabs_CohortFragmentDoc}`;
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
export const EditCohortModal_CohortFragmentDoc = gql`
    fragment EditCohortModal_Cohort on Cohort {
  id
  name
  startDate
  endDate
  grade
  hostKey
  meetingRoom
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
export const DeleteCohortModal_CohortFragmentDoc = gql`
    fragment DeleteCohortModal_Cohort on Cohort {
  id
  name
  staffAssignments {
    user {
      id
    }
  }
}
    `;
export const FlatCohortsTable_CohortFragmentDoc = gql`
    fragment FlatCohortsTable_Cohort on Cohort {
  id
  name
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
  ...EditCohortModal_Cohort
  ...DeleteCohortModal_Cohort
}
    ${EditCohortModal_CohortFragmentDoc}
${DeleteCohortModal_CohortFragmentDoc}`;
export const FlatCohortsPage_CohortsFragmentDoc = gql`
    fragment FlatCohortsPage_Cohorts on Query {
  cohorts {
    ...FlatCohortsTable_Cohort
  }
}
    ${FlatCohortsTable_CohortFragmentDoc}`;
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
export const EngagementDetailsPage_CommonFragmentDoc = gql`
    fragment EngagementDetailsPage_Common on Engagement {
  id
  name
  startDate
  endDate
  organization {
    id
    name
  }
  ...EngagementForEditEngagementModal
}
    ${EngagementForEditEngagementModalFragmentDoc}`;
export const EngagementDetailsTabs_CommonFragmentDoc = gql`
    fragment EngagementDetailsTabs_Common on Engagement {
  id
  organization {
    id
  }
  cohorts {
    id
  }
}
    `;
export const EngagementDetailsView_EngagementFragmentDoc = gql`
    fragment EngagementDetailsView_Engagement on Engagement {
  id
  name
  createdAt
  startDate
  endDate
  organization {
    id
    name
  }
  staffAssignments {
    user {
      id
      fullName
    }
    role
  }
}
    `;
export const EngagementDetailsTabs_DetailsFragmentDoc = gql`
    fragment EngagementDetailsTabs_Details on Engagement {
  ...EngagementDetailsTabs_Common
  ...EngagementDetailsView_Engagement
}
    ${EngagementDetailsTabs_CommonFragmentDoc}
${EngagementDetailsView_EngagementFragmentDoc}`;
export const EngagementDetailsPage_DetailsFragmentDoc = gql`
    fragment EngagementDetailsPage_Details on Engagement {
  ...EngagementDetailsPage_Common
  ...EngagementDetailsTabs_Details
}
    ${EngagementDetailsPage_CommonFragmentDoc}
${EngagementDetailsTabs_DetailsFragmentDoc}`;
export const CohortsTable_CohortFragmentDoc = gql`
    fragment CohortsTable_Cohort on Cohort {
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
export const CohortDetailsSidebar_CohortFragmentDoc = gql`
    fragment CohortDetailsSidebar_Cohort on Cohort {
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
export const AddNewCohortModal_EngagementFragmentDoc = gql`
    fragment AddNewCohortModal_Engagement on Engagement {
  id
  startDate
  endDate
}
    `;
export const EngagementCohortsViewFragmentDoc = gql`
    fragment EngagementCohortsView on Engagement {
  cohorts {
    ...CohortsTable_Cohort
    ...CohortDetailsSidebar_Cohort
  }
  ...AddNewCohortModal_Engagement
}
    ${CohortsTable_CohortFragmentDoc}
${CohortDetailsSidebar_CohortFragmentDoc}
${AddNewCohortModal_EngagementFragmentDoc}`;
export const EngagementDetailsTabs_CohortsFragmentDoc = gql`
    fragment EngagementDetailsTabs_Cohorts on Engagement {
  ...EngagementDetailsTabs_Common
  ...EngagementCohortsView
}
    ${EngagementDetailsTabs_CommonFragmentDoc}
${EngagementCohortsViewFragmentDoc}`;
export const EngagementDetailsPageCohortsFragmentDoc = gql`
    fragment EngagementDetailsPageCohorts on Engagement {
  ...EngagementDetailsPage_Common
  ...EngagementDetailsTabs_Cohorts
}
    ${EngagementDetailsPage_CommonFragmentDoc}
${EngagementDetailsTabs_CohortsFragmentDoc}`;
export const CsvUploadView_EngagementFragmentDoc = gql`
    fragment CsvUploadView_Engagement on Engagement {
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
}
    `;
export const EngagementDetailsTabs_CsvUploadFragmentDoc = gql`
    fragment EngagementDetailsTabs_CsvUpload on Engagement {
  ...EngagementDetailsTabs_Common
  ...CsvUploadView_Engagement
}
    ${EngagementDetailsTabs_CommonFragmentDoc}
${CsvUploadView_EngagementFragmentDoc}`;
export const EngagementDetailsPageCsvUploadFragmentDoc = gql`
    fragment EngagementDetailsPageCsvUpload on Engagement {
  ...EngagementDetailsPage_Common
  ...EngagementDetailsTabs_CsvUpload
}
    ${EngagementDetailsPage_CommonFragmentDoc}
${EngagementDetailsTabs_CsvUploadFragmentDoc}`;
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
export const WelcomePanel_UserFragmentDoc = gql`
    fragment WelcomePanel_User on User {
  fullName
  role
}
    `;
export const TeacherCohortsPanel_CohortFragmentDoc = gql`
    fragment TeacherCohortsPanel_Cohort on Cohort {
  id
  name
  grade
  meetingRoom
  startDate
  endDate
  staffAssignments {
    user {
      fullName
    }
    subject
  }
  engagement {
    name
  }
  ...CohortForScheduleCalendarModal
}
    ${CohortForScheduleCalendarModalFragmentDoc}`;
export const MentorTeacherHome_HomeFragmentDoc = gql`
    fragment MentorTeacherHome_Home on Query {
  currentUser {
    id
    ...WelcomePanel_User
  }
  teacherEngagements {
    startDate
    staffAssignments {
      user {
        id
      }
      role
    }
    cohorts {
      ...TeacherCohortsPanel_Cohort
    }
  }
}
    ${WelcomePanel_UserFragmentDoc}
${TeacherCohortsPanel_CohortFragmentDoc}`;
export const TutorTeacherHome_HomeFragmentDoc = gql`
    fragment TutorTeacherHome_Home on Query {
  currentUser {
    id
    ...WelcomePanel_User
  }
  teacherEngagements {
    startDate
    staffAssignments {
      user {
        id
      }
      role
    }
    cohorts {
      ...TeacherCohortsPanel_Cohort
    }
  }
  teacherCohorts {
    ...TeacherCohortsPanel_Cohort
  }
}
    ${WelcomePanel_UserFragmentDoc}
${TeacherCohortsPanel_CohortFragmentDoc}`;
export const NewOrgFragmentDoc = gql`
    fragment NewOrg on Organization {
  id
  name
  district
  subDistrict
  __typename
}
    `;
export const OrganizationDetailsView_OrganizationFragmentDoc = gql`
    fragment OrganizationDetailsView_Organization on Organization {
  id
  name
  createdAt
  location
  description
  district
  subDistrict
}
    `;
export const OrganizationTabs_DetailsFragmentDoc = gql`
    fragment OrganizationTabs_Details on Organization {
  id
  name
  engagements {
    id
    cohorts {
      id
    }
  }
  ...OrganizationDetailsView_Organization
}
    ${OrganizationDetailsView_OrganizationFragmentDoc}`;
export const OrganizationDetailPage_DetailsFragmentDoc = gql`
    fragment OrganizationDetailPage_Details on Organization {
  id
  description
  ...OrganizationTabs_Details
}
    ${OrganizationTabs_DetailsFragmentDoc}`;
export const EngagementsTable_EngagementFragmentDoc = gql`
    fragment EngagementsTable_Engagement on Engagement {
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
  organization {
    id
  }
}
    `;
export const OrganizationEngagementsView_EngagementsViewFragmentDoc = gql`
    fragment OrganizationEngagementsView_EngagementsView on Organization {
  engagements {
    ...EngagementsTable_Engagement
  }
}
    ${EngagementsTable_EngagementFragmentDoc}`;
export const OrganizationTabs_EngagementsFragmentDoc = gql`
    fragment OrganizationTabs_Engagements on Organization {
  id
  name
  district
  subDistrict
  location
  description
  ...OrganizationEngagementsView_EngagementsView
}
    ${OrganizationEngagementsView_EngagementsViewFragmentDoc}`;
export const OrganizationDetailPage_EngagementsFragmentDoc = gql`
    fragment OrganizationDetailPage_Engagements on Organization {
  id
  description
  ...OrganizationTabs_Engagements
}
    ${OrganizationTabs_EngagementsFragmentDoc}`;
export const OrganizationCohortsView_CohortsViewFragmentDoc = gql`
    fragment OrganizationCohortsView_CohortsView on Organization {
  engagements {
    id
    name
    startDate
    endDate
    organizationId
    cohorts {
      ...CohortDetailsSidebar_Cohort
      ...CohortsTable_Cohort
    }
  }
}
    ${CohortDetailsSidebar_CohortFragmentDoc}
${CohortsTable_CohortFragmentDoc}`;
export const OrganizationTabs_CohortsFragmentDoc = gql`
    fragment OrganizationTabs_Cohorts on Organization {
  id
  name
  district
  subDistrict
  location
  description
  ...OrganizationCohortsView_CohortsView
}
    ${OrganizationCohortsView_CohortsViewFragmentDoc}`;
export const OrganizationDetailPage_CohortsFragmentDoc = gql`
    fragment OrganizationDetailPage_Cohorts on Organization {
  id
  description
  ...OrganizationTabs_Cohorts
}
    ${OrganizationTabs_CohortsFragmentDoc}`;
export const OrganizationsTable_OrganizationFragmentDoc = gql`
    fragment OrganizationsTable_Organization on Organization {
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
    `;
export const OrganizationsPage_OrganizationsFragmentDoc = gql`
    fragment OrganizationsPage_Organizations on Query {
  organizations {
    ...OrganizationsTable_Organization
  }
}
    ${OrganizationsTable_OrganizationFragmentDoc}`;
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
    inviteSentAt
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
export const SearchCohortsDocument = gql`
    query SearchCohorts($query: String!) {
  searchCohorts(query: $query) {
    count
    results {
      ...FlatCohortsTable_Cohort
    }
  }
}
    ${FlatCohortsTable_CohortFragmentDoc}`;

/**
 * __useSearchCohortsQuery__
 *
 * To run a query within a React component, call `useSearchCohortsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCohortsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCohortsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchCohortsQuery(baseOptions: Apollo.QueryHookOptions<SearchCohortsQuery, SearchCohortsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCohortsQuery, SearchCohortsQueryVariables>(SearchCohortsDocument, options);
      }
export function useSearchCohortsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCohortsQuery, SearchCohortsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCohortsQuery, SearchCohortsQueryVariables>(SearchCohortsDocument, options);
        }
export type SearchCohortsQueryHookResult = ReturnType<typeof useSearchCohortsQuery>;
export type SearchCohortsLazyQueryHookResult = ReturnType<typeof useSearchCohortsLazyQuery>;
export type SearchCohortsQueryResult = Apollo.QueryResult<SearchCohortsQuery, SearchCohortsQueryVariables>;
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
export const SearchOrganizationsDocument = gql`
    query SearchOrganizations($query: String!) {
  searchOrganizations(query: $query) {
    count
    results {
      ...OrganizationsTable_Organization
    }
  }
}
    ${OrganizationsTable_OrganizationFragmentDoc}`;

/**
 * __useSearchOrganizationsQuery__
 *
 * To run a query within a React component, call `useSearchOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchOrganizationsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchOrganizationsQuery(baseOptions: Apollo.QueryHookOptions<SearchOrganizationsQuery, SearchOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchOrganizationsQuery, SearchOrganizationsQueryVariables>(SearchOrganizationsDocument, options);
      }
export function useSearchOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchOrganizationsQuery, SearchOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchOrganizationsQuery, SearchOrganizationsQueryVariables>(SearchOrganizationsDocument, options);
        }
export type SearchOrganizationsQueryHookResult = ReturnType<typeof useSearchOrganizationsQuery>;
export type SearchOrganizationsLazyQueryHookResult = ReturnType<typeof useSearchOrganizationsLazyQuery>;
export type SearchOrganizationsQueryResult = Apollo.QueryResult<SearchOrganizationsQuery, SearchOrganizationsQueryVariables>;
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
export const SearchUsersForUsersPageDocument = gql`
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
}
    `;

/**
 * __useSearchUsersForUsersPageQuery__
 *
 * To run a query within a React component, call `useSearchUsersForUsersPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersForUsersPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersForUsersPageQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchUsersForUsersPageQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersForUsersPageQuery, SearchUsersForUsersPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersForUsersPageQuery, SearchUsersForUsersPageQueryVariables>(SearchUsersForUsersPageDocument, options);
      }
export function useSearchUsersForUsersPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersForUsersPageQuery, SearchUsersForUsersPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersForUsersPageQuery, SearchUsersForUsersPageQueryVariables>(SearchUsersForUsersPageDocument, options);
        }
export type SearchUsersForUsersPageQueryHookResult = ReturnType<typeof useSearchUsersForUsersPageQuery>;
export type SearchUsersForUsersPageLazyQueryHookResult = ReturnType<typeof useSearchUsersForUsersPageLazyQuery>;
export type SearchUsersForUsersPageQueryResult = Apollo.QueryResult<SearchUsersForUsersPageQuery, SearchUsersForUsersPageQueryVariables>;
export const CohortDetailsPageDocument = gql`
    query CohortDetailsPage($id: ID!) {
  cohort(id: $id) {
    ...CohortDetailsPageDetails_Cohort
  }
}
    ${CohortDetailsPageDetails_CohortFragmentDoc}`;

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
export const FlatCohortsPageDocument = gql`
    query FlatCohortsPage {
  ...FlatCohortsPage_Cohorts
}
    ${FlatCohortsPage_CohortsFragmentDoc}`;

/**
 * __useFlatCohortsPageQuery__
 *
 * To run a query within a React component, call `useFlatCohortsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlatCohortsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlatCohortsPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useFlatCohortsPageQuery(baseOptions?: Apollo.QueryHookOptions<FlatCohortsPageQuery, FlatCohortsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FlatCohortsPageQuery, FlatCohortsPageQueryVariables>(FlatCohortsPageDocument, options);
      }
export function useFlatCohortsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FlatCohortsPageQuery, FlatCohortsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FlatCohortsPageQuery, FlatCohortsPageQueryVariables>(FlatCohortsPageDocument, options);
        }
export type FlatCohortsPageQueryHookResult = ReturnType<typeof useFlatCohortsPageQuery>;
export type FlatCohortsPageLazyQueryHookResult = ReturnType<typeof useFlatCohortsPageLazyQuery>;
export type FlatCohortsPageQueryResult = Apollo.QueryResult<FlatCohortsPageQuery, FlatCohortsPageQueryVariables>;
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
export const HomePageAdminDocument = gql`
    query HomePageAdmin {
  currentUser {
    fullName
  }
}
    `;

/**
 * __useHomePageAdminQuery__
 *
 * To run a query within a React component, call `useHomePageAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageAdminQuery(baseOptions?: Apollo.QueryHookOptions<HomePageAdminQuery, HomePageAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomePageAdminQuery, HomePageAdminQueryVariables>(HomePageAdminDocument, options);
      }
export function useHomePageAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomePageAdminQuery, HomePageAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomePageAdminQuery, HomePageAdminQueryVariables>(HomePageAdminDocument, options);
        }
export type HomePageAdminQueryHookResult = ReturnType<typeof useHomePageAdminQuery>;
export type HomePageAdminLazyQueryHookResult = ReturnType<typeof useHomePageAdminLazyQuery>;
export type HomePageAdminQueryResult = Apollo.QueryResult<HomePageAdminQuery, HomePageAdminQueryVariables>;
export const HomePageMentorDocument = gql`
    query HomePageMentor {
  ...MentorTeacherHome_Home
}
    ${MentorTeacherHome_HomeFragmentDoc}`;

/**
 * __useHomePageMentorQuery__
 *
 * To run a query within a React component, call `useHomePageMentorQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageMentorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageMentorQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageMentorQuery(baseOptions?: Apollo.QueryHookOptions<HomePageMentorQuery, HomePageMentorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomePageMentorQuery, HomePageMentorQueryVariables>(HomePageMentorDocument, options);
      }
export function useHomePageMentorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomePageMentorQuery, HomePageMentorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomePageMentorQuery, HomePageMentorQueryVariables>(HomePageMentorDocument, options);
        }
export type HomePageMentorQueryHookResult = ReturnType<typeof useHomePageMentorQuery>;
export type HomePageMentorLazyQueryHookResult = ReturnType<typeof useHomePageMentorLazyQuery>;
export type HomePageMentorQueryResult = Apollo.QueryResult<HomePageMentorQuery, HomePageMentorQueryVariables>;
export const HomePageTutorDocument = gql`
    query HomePageTutor {
  ...TutorTeacherHome_Home
}
    ${TutorTeacherHome_HomeFragmentDoc}`;

/**
 * __useHomePageTutorQuery__
 *
 * To run a query within a React component, call `useHomePageTutorQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageTutorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageTutorQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageTutorQuery(baseOptions?: Apollo.QueryHookOptions<HomePageTutorQuery, HomePageTutorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomePageTutorQuery, HomePageTutorQueryVariables>(HomePageTutorDocument, options);
      }
export function useHomePageTutorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomePageTutorQuery, HomePageTutorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomePageTutorQuery, HomePageTutorQueryVariables>(HomePageTutorDocument, options);
        }
export type HomePageTutorQueryHookResult = ReturnType<typeof useHomePageTutorQuery>;
export type HomePageTutorLazyQueryHookResult = ReturnType<typeof useHomePageTutorLazyQuery>;
export type HomePageTutorQueryResult = Apollo.QueryResult<HomePageTutorQuery, HomePageTutorQueryVariables>;
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
    ...OrganizationDetailPage_Cohorts
  }
}
    ${OrganizationDetailPage_CohortsFragmentDoc}`;

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
export const OrgDetailPageDetailsDocument = gql`
    query OrgDetailPageDetails($id: ID!) {
  organization(id: $id) {
    ...OrganizationDetailPage_Details
  }
}
    ${OrganizationDetailPage_DetailsFragmentDoc}`;

/**
 * __useOrgDetailPageDetailsQuery__
 *
 * To run a query within a React component, call `useOrgDetailPageDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgDetailPageDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgDetailPageDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrgDetailPageDetailsQuery(baseOptions: Apollo.QueryHookOptions<OrgDetailPageDetailsQuery, OrgDetailPageDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrgDetailPageDetailsQuery, OrgDetailPageDetailsQueryVariables>(OrgDetailPageDetailsDocument, options);
      }
export function useOrgDetailPageDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrgDetailPageDetailsQuery, OrgDetailPageDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrgDetailPageDetailsQuery, OrgDetailPageDetailsQueryVariables>(OrgDetailPageDetailsDocument, options);
        }
export type OrgDetailPageDetailsQueryHookResult = ReturnType<typeof useOrgDetailPageDetailsQuery>;
export type OrgDetailPageDetailsLazyQueryHookResult = ReturnType<typeof useOrgDetailPageDetailsLazyQuery>;
export type OrgDetailPageDetailsQueryResult = Apollo.QueryResult<OrgDetailPageDetailsQuery, OrgDetailPageDetailsQueryVariables>;
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
export const EngagementDetail_DetailsDocument = gql`
    query EngagementDetail_Details($id: ID!) {
  engagement(id: $id) {
    ...EngagementDetailsPage_Details
  }
}
    ${EngagementDetailsPage_DetailsFragmentDoc}`;

/**
 * __useEngagementDetail_DetailsQuery__
 *
 * To run a query within a React component, call `useEngagementDetail_DetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEngagementDetail_DetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEngagementDetail_DetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEngagementDetail_DetailsQuery(baseOptions: Apollo.QueryHookOptions<EngagementDetail_DetailsQuery, EngagementDetail_DetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EngagementDetail_DetailsQuery, EngagementDetail_DetailsQueryVariables>(EngagementDetail_DetailsDocument, options);
      }
export function useEngagementDetail_DetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EngagementDetail_DetailsQuery, EngagementDetail_DetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EngagementDetail_DetailsQuery, EngagementDetail_DetailsQueryVariables>(EngagementDetail_DetailsDocument, options);
        }
export type EngagementDetail_DetailsQueryHookResult = ReturnType<typeof useEngagementDetail_DetailsQuery>;
export type EngagementDetail_DetailsLazyQueryHookResult = ReturnType<typeof useEngagementDetail_DetailsLazyQuery>;
export type EngagementDetail_DetailsQueryResult = Apollo.QueryResult<EngagementDetail_DetailsQuery, EngagementDetail_DetailsQueryVariables>;
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
    ...OrganizationDetailPage_Engagements
  }
}
    ${OrganizationDetailPage_EngagementsFragmentDoc}`;

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
  ...OrganizationsPage_Organizations
}
    ${OrganizationsPage_OrganizationsFragmentDoc}`;

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
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    email
    accountStatus
    role
    fullName
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;