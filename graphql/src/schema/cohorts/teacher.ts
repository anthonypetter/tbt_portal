import { gql } from "apollo-server";
import { add } from "date-fns";
import { Context } from "../../context";
import { normalizeDateTimeToUTCDate } from "../../utils/dateTime";

/**
 * Type Defs
 */

export const typeDefs = gql`
  extend type Query {
    teacherCohorts: [Cohort!]!
    teacherEngagements: [Engagement!]!
  }
`;

/**
 * Query resolvers
 */

async function teacherCohorts(
  _parent: undefined,
  _args: undefined,
  { authedUser, CohortService }: Context
) {
  /**
   * This endpoint will return all current and future cohorts.
   * To accomplish this, we compare today's date with the cohort's end date.
   * If today <= cohort's end date, it means it's either currently active or
   * scheduled in the future.
   *
   * We're going subtract 24 hours to today's date to include cohorts
   * that just ended within the last 24 hours. After 24 hours have passed,
   * they'll be left out of the query.
   */

  const currentDate = new Date();
  const todaysUTCDate = normalizeDateTimeToUTCDate(currentDate);
  const paddedCurrentUTCDate = add(todaysUTCDate, { hours: -24 });

  const endDateFilter = {
    endDate: { gte: paddedCurrentUTCDate },
  };

  const cohorts = await CohortService.getCohortsAssignedToTeacher(
    authedUser.id,
    endDateFilter
  );

  return cohorts;
}

async function teacherEngagements(
  _parent: undefined,
  _args: undefined,
  { authedUser, EngagementService }: Context
) {
  const currentDate = new Date();
  const todaysUTCDate = normalizeDateTimeToUTCDate(currentDate);
  const paddedCurrentUTCDate = add(todaysUTCDate, { hours: -24 });

  const endDateFilter = {
    endDate: { gte: paddedCurrentUTCDate },
  };

  const engagements = await EngagementService.getEngagementsAssignedToTeacher(
    authedUser.id,
    endDateFilter
  );

  return engagements;
}

/**
 * Resolvers
 */

export const resolvers = {
  Query: {
    teacherCohorts,
    teacherEngagements,
  },
};
