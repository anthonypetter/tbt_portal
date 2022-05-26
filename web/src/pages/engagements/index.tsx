import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { FlatEngagementsPage } from "components/engagements/FlatEngagementsPage";
import { processResult } from "@utils/apollo";
import { getSession } from "@lib/apollo-client";
import { FlatEngagementsPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";

const GET_ALL_ENGAGEMENTS = gql`
  query FlatEngagementsPage {
    ...FlatEngagements
  }
  ${FlatEngagementsPage.fragments.engagements}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);
  const result: ApolloQueryResult<FlatEngagementsPageQuery> =
    await client.query({
      query: GET_ALL_ENGAGEMENTS,
    });

  const engagements = processResult(result, (r) => r.engagements);

  return {
    props: { engagements },
  };
}

type Props = {
  engagements: NonNullable<FlatEngagementsPageQuery["engagements"]>;
};

const Engagements: NextPage<Props> = ({ engagements }) => {
  const { data } = useQuery<FlatEngagementsPageQuery>(GET_ALL_ENGAGEMENTS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch engagements.",
      });
    },
  });

  return (
    <AuthedLayout>
      <FlatEngagementsPage engagements={data?.engagements ?? engagements} />
    </AuthedLayout>
  );
};

export default Engagements;
