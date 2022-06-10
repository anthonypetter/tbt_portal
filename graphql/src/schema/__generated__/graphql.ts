import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { CohortsWithBaseRelations as CohortsWithBaseRelationsModel } from 'src/services/cohort';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  engagementId: Scalars['ID'];
  exempt?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['String']>;
  hostKey?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  meetingId?: Maybe<Scalars['String']>;
  meetingRoom?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  schedule: Array<ScheduledMeeting>;
  staffAssignments: Array<CohortStaffAssignment>;
  startDate?: Maybe<Scalars['Date']>;
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
  cohortName: Scalars['String'];
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
  endTime: Scalars['String'];
  startTime: Scalars['String'];
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
  searchUsers: SearchResults;
  users: Array<User>;
};


export type QueryCohortArgs = {
  cohortId: Scalars['ID'];
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


export type QuerySearchUsersArgs = {
  query: Scalars['String'];
};

export type ScheduledMeeting = {
  __typename?: 'ScheduledMeeting';
  createdAt: Scalars['Date'];
  endTime: Scalars['String'];
  startTime: Scalars['String'];
  subject: AssignmentSubject;
  timeZone: Scalars['String'];
  weekday: Weekday;
};

export type SearchResults = {
  __typename?: 'SearchResults';
  count: Scalars['Int'];
  results: Array<User>;
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

export enum Weekday {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccountStatus: AccountStatus;
  AddCohortInput: AddCohortInput;
  AddEngagementInput: AddEngagementInput;
  AddOrganizationInput: AddOrganizationInput;
  AssignmentRole: AssignmentRole;
  AssignmentSubject: AssignmentSubject;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Cohort: ResolverTypeWrapper<CohortsWithBaseRelationsModel>;
  CohortStaffAssignment: ResolverTypeWrapper<CohortStaffAssignment>;
  CsvCohortStaffAssignment: CsvCohortStaffAssignment;
  CsvCohortTeacher: CsvCohortTeacher;
  CsvProcessedCohort: CsvProcessedCohort;
  CsvProcessedData: CsvProcessedData;
  CsvSaveCountsResult: ResolverTypeWrapper<CsvSaveCountsResult>;
  CsvSubjectSchedule: CsvSubjectSchedule;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  EditCohortInput: EditCohortInput;
  EditEngagementInput: EditEngagementInput;
  EditOrganizationInput: EditOrganizationInput;
  Engagement: ResolverTypeWrapper<Omit<Engagement, 'cohorts' | 'organization'> & { cohorts: Array<ResolversTypes['Cohort']>, organization: ResolversTypes['Organization'] }>;
  EngagementStaffAssignment: ResolverTypeWrapper<EngagementStaffAssignment>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InviteUserInput: InviteUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  NewCohortStaffAssignment: NewCohortStaffAssignment;
  NewEngagementStaffAssignment: NewEngagementStaffAssignment;
  Organization: ResolverTypeWrapper<Omit<Organization, 'engagements'> & { engagements: Array<ResolversTypes['Engagement']> }>;
  Query: ResolverTypeWrapper<{}>;
  ScheduledMeeting: ResolverTypeWrapper<ScheduledMeeting>;
  SearchResults: ResolverTypeWrapper<SearchResults>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
  Weekday: Weekday;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddCohortInput: AddCohortInput;
  AddEngagementInput: AddEngagementInput;
  AddOrganizationInput: AddOrganizationInput;
  Boolean: Scalars['Boolean'];
  Cohort: CohortsWithBaseRelationsModel;
  CohortStaffAssignment: CohortStaffAssignment;
  CsvCohortStaffAssignment: CsvCohortStaffAssignment;
  CsvCohortTeacher: CsvCohortTeacher;
  CsvProcessedCohort: CsvProcessedCohort;
  CsvProcessedData: CsvProcessedData;
  CsvSaveCountsResult: CsvSaveCountsResult;
  CsvSubjectSchedule: CsvSubjectSchedule;
  Date: Scalars['Date'];
  EditCohortInput: EditCohortInput;
  EditEngagementInput: EditEngagementInput;
  EditOrganizationInput: EditOrganizationInput;
  Engagement: Omit<Engagement, 'cohorts' | 'organization'> & { cohorts: Array<ResolversParentTypes['Cohort']>, organization: ResolversParentTypes['Organization'] };
  EngagementStaffAssignment: EngagementStaffAssignment;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  InviteUserInput: InviteUserInput;
  Mutation: {};
  NewCohortStaffAssignment: NewCohortStaffAssignment;
  NewEngagementStaffAssignment: NewEngagementStaffAssignment;
  Organization: Omit<Organization, 'engagements'> & { engagements: Array<ResolversParentTypes['Engagement']> };
  Query: {};
  ScheduledMeeting: ScheduledMeeting;
  SearchResults: SearchResults;
  String: Scalars['String'];
  User: User;
};

export type CohortResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cohort'] = ResolversParentTypes['Cohort']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  engagementId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  exempt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hostKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  meetingId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meetingRoom?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schedule?: Resolver<Array<ResolversTypes['ScheduledMeeting']>, ParentType, ContextType>;
  staffAssignments?: Resolver<Array<ResolversTypes['CohortStaffAssignment']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CohortStaffAssignmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['CohortStaffAssignment'] = ResolversParentTypes['CohortStaffAssignment']> = {
  subject?: Resolver<ResolversTypes['AssignmentSubject'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CsvSaveCountsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CsvSaveCountsResult'] = ResolversParentTypes['CsvSaveCountsResult']> = {
  newCohortCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  newTeacherCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EngagementResolvers<ContextType = any, ParentType extends ResolversParentTypes['Engagement'] = ResolversParentTypes['Engagement']> = {
  cohorts?: Resolver<Array<ResolversTypes['Cohort']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  staffAssignments?: Resolver<Array<ResolversTypes['EngagementStaffAssignment']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EngagementStaffAssignmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['EngagementStaffAssignment'] = ResolversParentTypes['EngagementStaffAssignment']> = {
  role?: Resolver<ResolversTypes['AssignmentRole'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addCohort?: Resolver<ResolversTypes['Cohort'], ParentType, ContextType, RequireFields<MutationAddCohortArgs, 'input'>>;
  addEngagement?: Resolver<ResolversTypes['Engagement'], ParentType, ContextType, RequireFields<MutationAddEngagementArgs, 'input'>>;
  addOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationAddOrganizationArgs, 'input'>>;
  deleteCohort?: Resolver<ResolversTypes['Cohort'], ParentType, ContextType, RequireFields<MutationDeleteCohortArgs, 'id'>>;
  deleteEngagement?: Resolver<ResolversTypes['Engagement'], ParentType, ContextType, RequireFields<MutationDeleteEngagementArgs, 'id'>>;
  deleteOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'id'>>;
  editCohort?: Resolver<ResolversTypes['Cohort'], ParentType, ContextType, RequireFields<MutationEditCohortArgs, 'input'>>;
  editEngagement?: Resolver<ResolversTypes['Engagement'], ParentType, ContextType, RequireFields<MutationEditEngagementArgs, 'input'>>;
  editOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationEditOrganizationArgs, 'input'>>;
  inviteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationInviteUserArgs, 'input'>>;
  saveCohortsCsvData?: Resolver<ResolversTypes['CsvSaveCountsResult'], ParentType, ContextType, RequireFields<MutationSaveCohortsCsvDataArgs, 'input'>>;
};

export type OrganizationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  district?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  engagements?: Resolver<Array<ResolversTypes['Engagement']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subDistrict?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cohort?: Resolver<ResolversTypes['Cohort'], ParentType, ContextType, RequireFields<QueryCohortArgs, 'cohortId'>>;
  cohorts?: Resolver<Array<ResolversTypes['Cohort']>, ParentType, ContextType>;
  cohortsForOrg?: Resolver<Array<ResolversTypes['Cohort']>, ParentType, ContextType, RequireFields<QueryCohortsForOrgArgs, 'organizationId'>>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  engagement?: Resolver<Maybe<ResolversTypes['Engagement']>, ParentType, ContextType, RequireFields<QueryEngagementArgs, 'id'>>;
  engagements?: Resolver<Array<ResolversTypes['Engagement']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationArgs, 'id'>>;
  organizations?: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  searchUsers?: Resolver<ResolversTypes['SearchResults'], ParentType, ContextType, RequireFields<QuerySearchUsersArgs, 'query'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type ScheduledMeetingResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScheduledMeeting'] = ResolversParentTypes['ScheduledMeeting']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['AssignmentSubject'], ParentType, ContextType>;
  timeZone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weekday?: Resolver<ResolversTypes['Weekday'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResults'] = ResolversParentTypes['SearchResults']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  accountStatus?: Resolver<ResolversTypes['AccountStatus'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Cohort?: CohortResolvers<ContextType>;
  CohortStaffAssignment?: CohortStaffAssignmentResolvers<ContextType>;
  CsvSaveCountsResult?: CsvSaveCountsResultResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Engagement?: EngagementResolvers<ContextType>;
  EngagementStaffAssignment?: EngagementStaffAssignmentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ScheduledMeeting?: ScheduledMeetingResolvers<ContextType>;
  SearchResults?: SearchResultsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

