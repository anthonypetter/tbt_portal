import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { UsersPage } from "components/UsersPage";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  return {
    props: {
      hello: "world",
    },
  };
}

const Users: NextPage = () => {
  const mockUsers = [
    { email: " victor@tutored.live", role: "Administrator", status: "Active" },
  ];

  return (
    <AuthedLayout>
      <UsersPage users={mockUsers} />
    </AuthedLayout>
  );
};

export default Users;
