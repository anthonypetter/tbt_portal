import { gql } from "@apollo/client";
import {
  AssignmentRole,
  MentorTeacherHome_HomeFragment,
} from "@generated/graphql";
import sortBy from "lodash/sortBy";
import React from "react";
import { SidePanel } from "./SidePanel";
import { TeacherCohortsPanel } from "./TeacherCohortsPanel";
import { WelcomePanel } from "./WelcomePanel";

MentorTeacherHome.fragments = {
  mentorHome: gql`
    fragment MentorTeacherHome_Home on Query {
      currentUser {
        id
        ...WelcomePanel_User
      }
      teacherEngagements {
        startDate
        staffAssignments {
          user {
            id
          }
          role
        }
        cohorts {
          ...TeacherCohortsPanel_Cohort
        }
      }
    }
    ${WelcomePanel.fragments.user}
    ${TeacherCohortsPanel.fragments.cohort}
  `,
};

export const MENTOR_STATIC_ANNOUNCEMENTS = [
  {
    title: "New portal is now live!",
    description: "Welcome to the new teacher portal!",
  },
  {
    title: "Tutoring sessions closed on July 4th",
    description:
      "We will not have tutoring sessions scheduled on Monday, July 4th, 2022.",
  },
];

type Props = {
  currentUser: NonNullable<MentorTeacherHome_HomeFragment["currentUser"]>;
  teacherEngagements: MentorTeacherHome_HomeFragment["teacherEngagements"];
};

export function MentorTeacherHome({ currentUser, teacherEngagements }: Props) {
  const mentoringEngagements = sortBy(
    teacherEngagements.filter((engagement) => {
      return engagement.staffAssignments.some(
        (assignment) =>
          assignment.user.id === currentUser.id &&
          assignment.role === AssignmentRole.MentorTeacher
      );
    }),
    (e) => e.startDate
  );

  const substitutingEngagements = sortBy(
    teacherEngagements.filter((engagement) => {
      return engagement.staffAssignments.some(
        (assignment) =>
          assignment.user.id === currentUser.id &&
          assignment.role === AssignmentRole.SubstituteTeacher
      );
    }),
    (e) => e.startDate
  );

  const mentoringCohorts = mentoringEngagements.flatMap((e) => e.cohorts);
  const substitutingCohorts = substitutingEngagements.flatMap((e) => e.cohorts);

  return (
    <div className="mt-8">
      <main className="pb-8">
        <div className="grid grid-cols-1 gap-4 items-start xl:grid-cols-3 xl:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <WelcomePanel user={currentUser} />

            <TeacherCohortsPanel
              title="Mentoring"
              teacherCohorts={mentoringCohorts}
            />

            <TeacherCohortsPanel
              title="Substituting"
              teacherCohorts={substitutingCohorts}
            />
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4">
            <SidePanel title="Announcements">
              {MENTOR_STATIC_ANNOUNCEMENTS.map((announcement, i) => (
                <SidePanel.Item
                  key={`${announcement.title}-${i}`}
                  title={announcement.title}
                  description={announcement.description}
                />
              ))}
            </SidePanel>
          </div>
        </div>
      </main>
    </div>
  );
}
