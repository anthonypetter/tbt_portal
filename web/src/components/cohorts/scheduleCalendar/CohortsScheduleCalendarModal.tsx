import { Cohort } from "@generated/graphql";
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
          // MOCKING //
          cohorts={cohorts.concat(cohorts).concat(cohorts)}
        />
      </div>
    </Modal>
  );
}
