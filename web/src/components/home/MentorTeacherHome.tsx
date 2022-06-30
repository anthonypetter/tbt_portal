import { gql } from "@apollo/client";
import { MentorTeacherHome_HomeFragment } from "@generated/graphql";
import { CalendarIcon, UsersIcon } from "@heroicons/react/solid";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { Container } from "components/Container";
import { Link } from "components/Link";
import { StartEndDateRangeText } from "components/StartEndDateRangeText";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import React from "react";
import { FaRegBuilding } from "react-icons/fa";
import { SidePanel } from "./SidePanel";
import { WelcomePanel } from "./WelcomePanel";

MentorTeacherHome.fragments = {
  mentorHome: gql`
    fragment MentorTeacherHome_Home on Query {
      ...WelcomePanel_User
      teacherEngagements {
        id
        name
        startDate
        endDate
        organization {
          id
          name
        }
        staffAssignments {
          role
          user {
            fullName
          }
        }
        cohorts {
          staffAssignments {
            subject
          }
        }
      }
    }
    ${WelcomePanel.fragments.user}
  `,
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

type Props = {
  currentUser: NonNullable<MentorTeacherHome_HomeFragment["currentUser"]>;
  teacherEngagements: MentorTeacherHome_HomeFragment["teacherEngagements"];
};

export function MentorTeacherHome({ currentUser, teacherEngagements }: Props) {
  return (
    <div className="mt-8">
      <main className="pb-8">
        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-8 lg:col-span-2">
            <WelcomePanel user={currentUser} />

            <Container className="mt-0">
              <TeacherEngagementsPanel
                teacherEngagements={teacherEngagements}
              />
            </Container>
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

function TeacherEngagementsPanel({
  teacherEngagements,
}: {
  teacherEngagements: MentorTeacherHome_HomeFragment["teacherEngagements"];
}) {
  console.log("teacherEngagements", teacherEngagements);

  return (
    <div>
      <h2
        className="text-base font-medium text-gray-900"
        id="announcements-title"
      >
        Mentoring
      </h2>
      <div className="flow-root mt-2">
        <ul role="list" className="divide-y divide-gray-200">
          {teacherEngagements.map((engagement) => {
            const subjects = sortBy(
              uniq(
                engagement.cohorts.flatMap((cohort) =>
                  cohort.staffAssignments.map((sa) => sa.subject)
                )
              )
            );

            const teachers = sortBy(
              uniq(engagement.staffAssignments.map((sa) => sa.user.fullName))
            );

            return (
              <li key={engagement.id}>
                <div className="block hover:bg-gray-50">
                  <div className="py-4">
                    <div className="flex items-center justify-between">
                      <Link href="" className="text-sm truncate">
                        {engagement.name}
                      </Link>
                      <div className="ml-2 flex-shrink-0 flex">
                        {subjects.map((s) => (
                          <AssignmentSubjectBadge
                            key={s}
                            subject={s}
                            className="mr-2"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <FaRegBuilding
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {engagement.organization.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <UsersIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {teachers.join(", ")}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <CalendarIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <p>
                          <StartEndDateRangeText
                            startDateMs={engagement.startDate}
                            endDateMs={engagement.endDate}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
