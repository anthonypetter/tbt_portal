import { gql } from "@apollo/client";
import { TutorTeacherHome_HomeFragment } from "@generated/graphql";
import React from "react";
import { SidePanel } from "./SidePanel";
import { WelcomePanel } from "./WelcomePanel";

TutorTeacherHome.fragments = {
  tutorHome: gql`
    fragment TutorTeacherHome_Home on Query {
      ...WelcomePanel_User
    }
    ${WelcomePanel.fragments.user}
  `,
};

type Props = {
  currentUser: NonNullable<TutorTeacherHome_HomeFragment["currentUser"]>;
};

export const STATIC_ANNOUNCEMENTS = [
  {
    title: "New portal is now live!",
    href: "#",
    preview: "Welcome to the new teacher portal!",
  },
  {
    title: "Tutoring sessions closed on July 4th",
    href: "#",
    preview:
      "We will not have tutoring sessions scheduled on Monday, July 4th, 2022.",
  },
];

export function TutorTeacherHome({ currentUser }: Props) {
  return (
    <div className="mt-8">
      <main className="pb-8">
        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-8 lg:col-span-2">
            <WelcomePanel user={currentUser} />
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4">
            <SidePanel title="Announcements">
              {STATIC_ANNOUNCEMENTS.map((announcement, i) => (
                <SidePanel.Item
                  key={`${announcement.title}-${i}`}
                  title={announcement.title}
                  description={announcement.preview}
                />
              ))}
            </SidePanel>
          </div>
        </div>
      </main>
    </div>
  );
}
