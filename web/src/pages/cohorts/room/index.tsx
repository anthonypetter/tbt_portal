import { AuthedLayout } from "components/AuthedLayout";
import { WherebyRoom } from "components/cohorts/WherebyRoom";
import { PageHeader } from "components/PageHeader";
import { NextPage } from "next";
import { useRouter } from "next/router";

const CohortRoom: NextPage = () => {
  const { query } = useRouter();

  return (
    <AuthedLayout>
      <PageHeader title="Cohort Room" />
      <WherebyRoom roomUrl={`${query.roomUrl}`} />
    </AuthedLayout>
  );
};

export default CohortRoom;
