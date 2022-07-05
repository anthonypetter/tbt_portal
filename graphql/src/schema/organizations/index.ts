import {
  MutationAddOrganizationArgs,
  MutationDeleteOrganizationArgs,
  MutationEditOrganizationArgs,
  QueryOrganizationArgs,
} from "@generated/graphql";
import { gql } from "apollo-server";
import { Context } from "../../context";
import { parseId } from "../../utils/numbers";
import { OrganizationResolver } from "./OrganizationResolver";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Organization {
    id: ID!
    createdAt: Date!
    name: String!
    location: String
    description: String
    district: String
    subDistrict: String
    engagements: [Engagement!]!
  }

  input AddOrganizationInput {
    name: String!
    description: String
    district: String
    subDistrict: String
  }

  input EditOrganizationInput {
    id: ID!
    name: String
    description: String
    district: String
    subDistrict: String
  }

  extend type Query {
    organizations: [Organization!]!
    organization(id: ID!): Organization
  }

  extend type Mutation {
    addOrganization(input: AddOrganizationInput!): Organization!
    editOrganization(input: EditOrganizationInput!): Organization!
    deleteOrganization(id: ID!): Organization!
  }
`;

/**
 * Query Resolvers
 */

async function organizations(
  _parent: undefined,
  _args: undefined,
  { authedUser, AuthorizationService, OrganizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return OrganizationService.getOrganizations();
}

async function organization(
  _parent: undefined,
  { id }: QueryOrganizationArgs,
  { authedUser, AuthorizationService, OrganizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return OrganizationService.getOrganization(parseId(id));
}

/**
 * Mutation resolvers
 */

async function addOrganization(
  _parent: undefined,
  { input }: MutationAddOrganizationArgs,
  { authedUser, AuthorizationService, OrganizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  return OrganizationService.addOrganization({
    name: input.name,
    description: input.description,
    district: input.district,
    subDistrict: input.subDistrict,
  });
}

async function editOrganization(
  _parent: undefined,
  { input }: MutationEditOrganizationArgs,
  { authedUser, AuthorizationService, OrganizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  // We allow name to come in undefined (represents when the user is not trying to update the name field)
  // But if name *does* come in, we don't allow it to be null.
  // Not quite sure how to represent this in graphql schema yet.
  if (input.name == null) {
    throw new Error("Organization name cannot be null.");
  }

  // If input fields come in undefined, they go to prisma undefined.
  // Prisma will ignore fields that are undefined and will not update them.
  return OrganizationService.editOrganization({
    id: parseId(input.id),
    name: input.name,
    district: input.district,
    subDistrict: input.subDistrict,
    description: input.description,
  });
}

async function deleteOrganization(
  _parent: undefined,
  { id }: MutationDeleteOrganizationArgs,
  { authedUser, AuthorizationService, OrganizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  return OrganizationService.deleteOrganization(parseId(id));
}

export const resolvers = {
  Query: {
    organizations,
    organization,
  },
  Mutation: {
    addOrganization,
    editOrganization,
    deleteOrganization,
  },
  Organization: OrganizationResolver,
};
