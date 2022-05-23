import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type AddEngagementInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  name: Scalars['String'];
  newStaffAssignments: Array<NewStaffAssignment>;
  organizationId: Scalars['ID'];
  startDate?: InputMaybe<Scalars['Date']>;
};

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

export type EditCohortInput = {
  endDate?: InputMaybe<Scalars['Date']>;
  grade?: InputMaybe<Scalars['String']>;
  hostKey?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  meetingRoom?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newStaffAssignments?: InputMaybe<Array<NewStaffAssignment>>;
  startDate?: InputMaybe<Scalars['Date']>;
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
  organization: Organization;
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
  addEngagement: Engagement;
  addOrganization: Organization;
  deleteEngagement: Engagement;
  deleteOrganization: Organization;
  editCohort: Cohort;
  editEngagement: Engagement;
  editOrganization: Organization;
  inviteUser: User;
};


export type MutationAddEngagementArgs = {
  input: AddEngagementInput;
};


export type MutationAddOrganizationArgs = {
  input: AddOrganizationInput;
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
  engagement?: Maybe<Engagement>;
  engagements: Array<Engagement>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  searchUsers: SearchResults;
  users: Array<User>;
};


export type QueryCohortsArgs = {
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
  AddEngagementInput: AddEngagementInput;
  AddOrganizationInput: AddOrganizationInput;
  AssignmentRole: AssignmentRole;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Cohort: ResolverTypeWrapper<Cohort>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  EditCohortInput: EditCohortInput;
  EditEngagementInput: EditEngagementInput;
  EditOrganizationInput: EditOrganizationInput;
  Engagement: ResolverTypeWrapper<Engagement>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InviteUserInput: InviteUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  NewStaffAssignment: NewStaffAssignment;
  Organization: ResolverTypeWrapper<Organization>;
  Query: ResolverTypeWrapper<{}>;
  SearchResults: ResolverTypeWrapper<SearchResults>;
  StaffAssignment: ResolverTypeWrapper<StaffAssignment>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddEngagementInput: AddEngagementInput;
  AddOrganizationInput: AddOrganizationInput;
  Boolean: Scalars['Boolean'];
  Cohort: Cohort;
  Date: Scalars['Date'];
  EditCohortInput: EditCohortInput;
  EditEngagementInput: EditEngagementInput;
  EditOrganizationInput: EditOrganizationInput;
  Engagement: Engagement;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  InviteUserInput: InviteUserInput;
  Mutation: {};
  NewStaffAssignment: NewStaffAssignment;
  Organization: Organization;
  Query: {};
  SearchResults: SearchResults;
  StaffAssignment: StaffAssignment;
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
  meetingRoom?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  staffAssignments?: Resolver<Array<ResolversTypes['StaffAssignment']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
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
  staffAssignments?: Resolver<Array<ResolversTypes['StaffAssignment']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addEngagement?: Resolver<ResolversTypes['Engagement'], ParentType, ContextType, RequireFields<MutationAddEngagementArgs, 'input'>>;
  addOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationAddOrganizationArgs, 'input'>>;
  deleteEngagement?: Resolver<ResolversTypes['Engagement'], ParentType, ContextType, RequireFields<MutationDeleteEngagementArgs, 'id'>>;
  deleteOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'id'>>;
  editCohort?: Resolver<ResolversTypes['Cohort'], ParentType, ContextType, RequireFields<MutationEditCohortArgs, 'input'>>;
  editEngagement?: Resolver<ResolversTypes['Engagement'], ParentType, ContextType, RequireFields<MutationEditEngagementArgs, 'input'>>;
  editOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationEditOrganizationArgs, 'input'>>;
  inviteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationInviteUserArgs, 'input'>>;
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
  cohorts?: Resolver<Array<ResolversTypes['Cohort']>, ParentType, ContextType, RequireFields<QueryCohortsArgs, 'organizationId'>>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  engagement?: Resolver<Maybe<ResolversTypes['Engagement']>, ParentType, ContextType, RequireFields<QueryEngagementArgs, 'id'>>;
  engagements?: Resolver<Array<ResolversTypes['Engagement']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationArgs, 'id'>>;
  organizations?: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  searchUsers?: Resolver<ResolversTypes['SearchResults'], ParentType, ContextType, RequireFields<QuerySearchUsersArgs, 'query'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type SearchResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResults'] = ResolversParentTypes['SearchResults']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StaffAssignmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['StaffAssignment'] = ResolversParentTypes['StaffAssignment']> = {
  assignmentRole?: Resolver<ResolversTypes['AssignmentRole'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
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
  Date?: GraphQLScalarType;
  Engagement?: EngagementResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchResults?: SearchResultsResolvers<ContextType>;
  StaffAssignment?: StaffAssignmentResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

