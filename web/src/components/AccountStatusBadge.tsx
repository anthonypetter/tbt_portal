import { AccountStatus } from "@generated/graphql";
import { Badge } from "./Badge";
import { assertUnreachable } from "utils/types";

type Props = {
  accountStatus: AccountStatus;
};

export function AccountStatusBadge({ accountStatus }: Props) {
  switch (accountStatus) {
    case AccountStatus.Active: {
      return (
        <Badge className="text-green-800 bg-green-100">
          {getText(accountStatus)}
        </Badge>
      );
    }

    case AccountStatus.Disabled: {
      return (
        <Badge className="text-red-800 bg-red-100">
          {getText(accountStatus)}
        </Badge>
      );
    }

    case AccountStatus.Pending: {
      return (
        <Badge className="text-yellow-800 bg-yellow-100">
          {getText(accountStatus)}
        </Badge>
      );
    }

    default:
      return assertUnreachable(accountStatus, "AccountStatusBadge");
  }
}

function getText(accountStatus: AccountStatus): string {
  switch (accountStatus) {
    case AccountStatus.Active:
      return "Active";

    case AccountStatus.Disabled:
      return "Disabled";

    case AccountStatus.Pending:
      return "Pending";

    default:
      return assertUnreachable(accountStatus, "AccountStatusBadge text");
  }
}
