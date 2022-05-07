import { gql } from "apollo-server";
import { Context } from "../../context";
import {
  MutationAddOrganizationArgs,
  MutationEditOrganizationArgs,
  MutationDeleteOrganizationArgs,
} from "@generated/graphql";
import { parseId } from "../../utils/numbers";
import { OrganizationService } from "@services/organization";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    district: String
    subDistrict: String
  }

  input AddOrganizationInput {
    name: String!
    district: String
    subDistrict: String
  }

  input EditOrganizationInput {
    id: ID!
    name: String
    district: String
    subDistrict: String
  }

  extend type Query {
    organizations: [Organization!]!
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
  return OrganizationService.getOrgs(50);
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

  return OrganizationService.addOrg({
    name: input.name,
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
  });
}

async function deleteOrganization(
  _parent: undefined,
  { id }: MutationDeleteOrganizationArgs,
  { authedUser, AuthorizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  return OrganizationService.deleteOrganization(parseId(id));
}

export const resolvers = {
  Query: {
    organizations,
  },
  Mutation: {
    addOrganization,
    editOrganization,
    deleteOrganization,
  },
};
