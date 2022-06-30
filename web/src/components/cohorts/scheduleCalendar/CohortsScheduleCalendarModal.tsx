import { gql } from "@apollo/client";
import { CohortForCohortsScheduleCalendarFragment } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { Modal } from "components/Modal";
import { CohortsScheduleCalendar } from "./CohortsScheduleCalendar";

CohortsScheduleCalendarModal.fragments = {
  cohort: gql`
    fragment CohortForScheduleCalendarModal on Cohort {
      ...CohortForCohortsScheduleCalendar
    }
    ${CohortsScheduleCalendar.fragments.cohort}
  `,
};

type CohortsScheduleCalendarModalProps = {
  show: boolean;
  closeModal: () => void;
  cohorts: CohortForCohortsScheduleCalendarFragment[];
  afterLeave?: () => void;
};

export function CohortsScheduleCalendarModal({
  show,
  closeModal,
  cohorts,
  afterLeave,
}: CohortsScheduleCalendarModalProps) {
  return (
    <Modal
      show={show}
      onClose={() => closeModal()}
      onDismissClick={() => closeModal()}
      icon={
        <Modal.Icon className="bg-blue-100">
          <CalendarIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
        </Modal.Icon>
      }
      title="Cohort Weekly Schedule"
      width="xlarge"
      afterLeave={afterLeave}
    >
      <div className="container mx-auto">
        <h1 className="text-xl2 mb-3">
          {cohorts
            .map((cohort) => `${cohort.name} (Grade ${cohort.grade ?? "?"})`)
            .join(", ")}
        </h1>
        <div className="h-[75vh]">
          <CohortsScheduleCalendar cohorts={cohorts} />
        </div>
      </div>
    </Modal>
  );
}
