import { Context } from "../../context";
import { Cohort } from "../__generated__/graphql";

export const CohortResolver = {
  async staffAssignments(
    parent: Cohort,
    _args: undefined,
    { authedUser, AuthorizationService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);

    return parent.staffAssignments.map((sa) => ({
      user: sa.user,
      assignmentRole: sa.assignmentRole,
    }));
  },
};
