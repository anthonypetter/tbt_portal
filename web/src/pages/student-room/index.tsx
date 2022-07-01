import { getRoomUrl } from "@utils/roomUrls";
import { WherebyRoom } from "components/cohorts/WherebyRoom";
import { Layout } from "components/Layout";
import { useRouter } from "next/router";

export default function StudentRoom() {
  const { query } = useRouter();
  const roomUrl = query?.meetingUrl
    ? getRoomUrl(`${query.meetingUrl}`).student
    : null;

  return (
    <div>
      {roomUrl ? (
        <WherebyRoom roomUrl={`${roomUrl}`} />
      ) : (
        <Layout>
          <div className="flex h-screen justify-center"></div>
        </Layout>
      )}
    </div>
  );
}
