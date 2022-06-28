import { gql } from "@apollo/client";
import { CohortDetailsRoomFragment } from "@generated/graphql";
import { getRoomUrl } from "@utils/roomUrls";
import { AuthHeader } from "components/AuthHeader";
import { WherebyRoom } from "./WherebyRoom";

CohortRoomPage.fragments = {
  roomCohort: gql`
    fragment CohortDetailsRoom on Cohort {
      id
      name
      meetingRoom
      hostKey
      startDate
      endDate
    }
  `,
};

type Props = {
  cohort: NonNullable<CohortDetailsRoomFragment>;
  roomType: string;
};

export function CohortRoomPage({ cohort, roomType }: Props) {
  const roomUrl = getRoomUrl(
    `${cohort.meetingRoom}${
      roomType === "host" ? "?roomKey=" + cohort.hostKey : ""
    }`
  )[`${roomType}`];
  return (
    <div>
      <AuthHeader />
      {cohort?.meetingRoom && <WherebyRoom roomUrl={`${roomUrl}`} />}
    </div>
  );
}
