import { gql } from "@apollo/client";
import { WelcomePanel_UserFragment } from "@generated/graphql";
import { Avatar } from "components/Avatar";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { RoleText } from "components/RoleText";
import React from "react";

WelcomePanel.fragments = {
  user: gql`
    fragment WelcomePanel_User on User {
      fullName
      role
    }
  `,
};

export function WelcomePanel({ user }: { user: WelcomePanel_UserFragment }) {
  return (
    <section aria-labelledby="profile-overview-title">
      <Container>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5 sm:items-center">
            <div className="flex-shrink-0">
              <Avatar className="h-[70px] w-[70px] text-gray-600 mx-auto" />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-sm font-medium text-gray-600">
                {getGreeting(getTimeOfDay(new Date().getHours()))},
              </p>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                {user.fullName}
              </p>
              <RoleText
                role={user.role}
                className="text-sm font-medium text-gray-600"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-center sm:mt-0">
            <Button
              theme="tertiary"
              disabled
              className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View profile
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function getGreeting(timeOfDay: TimeOfDay) {
  switch (timeOfDay) {
    case TimeOfDay.MORNING:
      return "Good morning";

    case TimeOfDay.AFTERNOON:
      return "Good afternoon";

    case TimeOfDay.EVENING:
      return "Good evening";

    default:
      return "Hello";
  }
}

enum TimeOfDay {
  MORNING,
  AFTERNOON,
  EVENING,
}

export function getTimeOfDay(currentHour: number) {
  if (currentHour < 12) {
    return TimeOfDay.MORNING;
  } else if (currentHour < 18) {
    return TimeOfDay.AFTERNOON;
  } else {
    return TimeOfDay.EVENING;
  }
}
