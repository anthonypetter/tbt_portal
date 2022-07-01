import { gql } from "@apollo/client";
import {
  AssignmentRole,
  TutorTeacherHome_HomeFragment,
} from "@generated/graphql";
import sortBy from "lodash/sortBy";
import React from "react";
import { SidePanel } from "./SidePanel";
import { TeacherCohortsPanel } from "./TeacherCohortsPanel";
import { WelcomePanel } from "./WelcomePanel";

TutorTeacherHome.fragments = {
  tutorHome: gql`
    fragment TutorTeacherHome_Home on Query {
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
      teacherCohorts {
        ...TeacherCohortsPanel_Cohort
      }
    }
    ${WelcomePanel.fragments.user}
    ${TeacherCohortsPanel.fragments.cohort}
  `,
};

type Props = {
  currentUser: NonNullable<TutorTeacherHome_HomeFragment["currentUser"]>;
  teacherEngagements: TutorTeacherHome_HomeFragment["teacherEngagements"];
  teacherCohorts: TutorTeacherHome_HomeFragment["teacherCohorts"];
};

export const TEACHER_STATIC_ANNOUNCEMENTS = [
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

export function TutorTeacherHome({
  currentUser,
  teacherEngagements,
  teacherCohorts,
}: Props) {
  const substitutingCohorts = sortBy(
    teacherEngagements.filter((engagement) =>
      engagement.staffAssignments.some(
        (assignment) =>
          assignment.user.id === currentUser.id &&
          assignment.role === AssignmentRole.SubstituteTeacher
      )
    ),
    (e) => e.startDate
  ).flatMap((e) => e.cohorts);

  return (
    <div className="mt-8">
      <main className="pb-8">
        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-8 lg:col-span-2">
            <WelcomePanel user={currentUser} />

            <TeacherCohortsPanel
              title="Teaching"
              teacherCohorts={teacherCohorts}
            />

            <TeacherCohortsPanel
              title="Substituting"
              teacherCohorts={substitutingCohorts}
            />
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4">
            <SidePanel title="Announcements">
              {TEACHER_STATIC_ANNOUNCEMENTS.map((announcement, i) => (
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
