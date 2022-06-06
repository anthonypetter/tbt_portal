import { Cohort, CohortMockSchedule } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { Modal } from "components/Modal";
import noop from "lodash/noop";
import { CohortsScheduleCalendar } from "./CohortsScheduleCalendar";

type CohortsScheduleCalendarModalProps = {
  show: boolean;
  closeModal: () => void;
  cohorts: Cohort[];
};

export function CohortsScheduleCalendarModal({
  show,
  closeModal,
  cohorts,
}: CohortsScheduleCalendarModalProps) {
  //////////// MOCK Schedule data for this Cohort ////////////
  const cohortsMockSchedule: CohortMockSchedule[] = cohorts.map(cohort => ({
    ...cohort,
    __typename: "CohortMockSchedule",
    weeklySchedule: {
      monday: [
        {
          subject: "MATH",
          startTime: "11:30",
          endTime: "12:30",
          timezone: "EST",
        },
        {
          subject: "ELA",
          startTime: "12:30",
          endTime: "13:30",
          timezone: "EST",
        },
      ],
      tuesday: [
        {
          subject: "MATH",
          startTime: "11:30",
          endTime: "12:30",
          timezone: "EST",
        },
        {
          subject: "ELA",
          startTime: "12:30",
          endTime: "13:30",
          timezone: "EST",
        },
      ],
      wednesday: [
        {
          subject: "MATH",
          startTime: "11:30",
          endTime: "12:30",
          timezone: "EST",
        },
        {
          subject: "ELA",
          startTime: "12:30",
          endTime: "13:30",
          timezone: "EST",
        },
      ],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  } as CohortMockSchedule));

  return (
    <Modal
      show={show}
      onClose={noop}
      onOutsideClick={() => closeModal()}
      onDismissClick={() => closeModal()}
      icon={
        <Modal.Icon className="bg-blue-100">
          <CalendarIcon
            className="w-6 h-6 text-blue-600"
            aria-hidden="true"
          />
        </Modal.Icon>
      }
      title="Cohort Weekly Schedule"
      width="xlarge"
    >
      <div className="container mx-auto">
        <h1 className="text-xl2 mb-3">
          {cohorts.map(cohort => `${cohort.name} (Grade ${cohort.grade ?? "?"})`).join(", ")}
        </h1>
        <CohortsScheduleCalendar
          cohorts={cohortsMockSchedule}
        />
      </div>
    </Modal>
  );
}
